import { Request, Response } from "express";
import Busboy from 'busboy'
import S3 from 'aws-sdk/clients/s3'
import { validator, asyncValidateStream } from '../utils/validator'
import fs from "fs"
const config = require("js-yaml").load(fs.readFileSync('config/migrator.yml'))

function textInputValidator(req: Request, res: Response): Response {
  const { type, data } = req.body;
  let result: { [key: string]: any } = {}
  try {
    result = validator(type, JSON.parse(data));
  } catch (error) {
    return res.json({ 
      error: 'Please provide a single valid JSON input',
      dataType: type})
  }
  return res.json(result)
}

export function fileValidator(req: Request, res: Response): Response | void {
  let result: {[key: string]: any} | unknown = {}

  const busboy = new Busboy({ headers: req.headers, limits: { fields: 1, files: 1 } });
  let type :string = '';

  busboy.on('field', (fieldname, value): Response | void => {
    if (fieldname !== 'type' || !value) {
      return res.json({
        error: `Incorrect field name: ${fieldname}`,
        dataType: type})
    }
    type = value;
  })
  busboy.on('file', async(fieldname, file, _1, _2, mimetype): Promise<Response> => {
    if (fieldname !== 'file') {
      return res.json({
        error: `Incorrect field name: ${fieldname}`,
        dataType: type
      })
    }
    if (mimetype !== 'application/x-gzip') {
      return res.json({
        error: 'Please upload files only in *.txt.gz format',
        dataType: type
      })
    }

    try {
      result = await asyncValidateStream(file, type)
    } catch(error) {
      return res.json({
        error,
        dataType: type
      })
    }
    return res.json(result)
  })

  req.pipe(busboy)
}

async function validateByKey(s3:any, data: any, type: string) {
  const { Name, Contents } = data
  let result: {[key: string]: any} | any = {}
  for(const file of Contents) {
    const key = file.Key
    try {
      const readableStream = s3.getObject({
      Bucket: Name,
      Key: key 
    })
    .createReadStream()
    result = await asyncValidateStream(readableStream, type, result)
    } catch(error) {
      result.error = error
      if(!result.errorKeys) {
        result.errorKeys = []
      }
      result.errorKeys.push(key.split('/').pop())
    }
  }
  return result
}

export async function s3keyValidator(req: Request, res: Response): Promise<Response | void> {
  const { type, data: path } = req.body
  const s3keyParts = path.split('/')
  const bucket = s3keyParts[2]
  const keyPrefix = s3keyParts.slice(3).join('/') + '/' + type.toLowerCase()
  const s3 = new S3({
    accessKeyId: config['accessKeyId'],
    secretAccessKey: config['secretAccessKey']
  })

  s3.listObjectsV2({
    Bucket: bucket,
    Prefix: keyPrefix
  }, async (err, data) => {
    if(err) {
      return res.json({
        error: err.message,
        dataType: type
        })
    }
    if(data.Contents!.length === 0) {
      return res.json({ 
        error: `No files with prefix ${type.toLowerCase()} found in ${s3keyParts.slice(3).join('/')}`,
        dataType: type})
    }
    const result = await validateByKey(s3, data, type)
    return res.json(result)
  })
}

export function intermediateValidator(req: Request, res: Response): Response | any {
  const validateType = req.query.source

  switch(validateType) {
    case 'Direct':
      return textInputValidator(req, res)
    case 'File':
      return fileValidator(req, res)
    case 'S3':
      return s3keyValidator(req, res)
  }
}