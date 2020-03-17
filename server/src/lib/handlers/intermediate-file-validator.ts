import { Request, Response } from "express";
import Busboy from 'busboy'
import S3 from 'aws-sdk/clients/s3'
import {validator, asyncValidateStream, typesPath} from '../utils/validator'
import fs from "fs"
import { PassThrough } from 'stream'
const config = require("js-yaml").load(fs.readFileSync('config/migrator.yml'))

export function textInputValidator(req: Request, res: Response): void {
  const { type, data } = req.body;
  let result: Object | string = {}
  try {
    result = validator(type, typesPath, JSON.parse(data));
  } catch (error) {
    res.json({ result: 'Please provide a single valid JSON input' })
    return
  }
  res.json({
   result
  });
}

export function fileValidator(req: Request, res: Response): void {
  let result: {[key: string]: any} | unknown = {}
  const fileStream = new PassThrough()
  
  const busboy = new Busboy({ headers: req.headers, limits: { fields: 1, files: 1 } });
  let type :string = '';

  busboy.on('field', (fieldname, value) => {
    if (fieldname !== 'type' || !value) {
      res.json({ result: `Incorrect field name: ${fieldname}`})
      return
    }
    type = value;
  })
  busboy.on('file', (fieldname, file, _1, _2, mimetype) => {
    if (fieldname !== 'file') {
      res.json({ result: `Incorrect field name: ${fieldname}`})
      return
    }
    if (mimetype !== 'application/x-gzip') {
      res.json({ result: 'Please upload files only in *.txt.gz format'})
      return
    }
    file.resume()
    file.pipe(fileStream)
  })

  busboy.on('finish', async () => {
    result = await asyncValidateStream(fileStream, type)
    res.json({result})
  })
  req.pipe(busboy)
}

async function validateByKey(s3:any, data: any, type: string) {
  const { Name, Contents } = data
  let result: {[key: string]: any} | any = {}
  for(const file of Contents) {
    const key = file.Key
    const readableStream = s3.getObject({
      Bucket: Name,
      Key: key 
    })
    .createReadStream()
    result = await asyncValidateStream(readableStream, type, result)
  }
  return result
}

export async function s3keyValidator(req: Request, res: Response){
  const { type, path } = req.body
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
      res.json({result: err.message})
      return
    }
    if(data.Contents!.length === 0) {
      res.json({result: `No files with prefix ${type.toLowerCase()} found in ${s3keyParts.slice(3).join('/')}`})
      return
    }
    const result = await validateByKey(s3, data, type)
    res.json({result})
  })
}
