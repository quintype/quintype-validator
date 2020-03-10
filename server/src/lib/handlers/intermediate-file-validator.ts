import { Request, Response } from "express";
import Busboy from 'busboy'
import S3 from 'aws-sdk/clients/s3'
import {validator, asyncValidateStream, typesPath} from '../utils/validator'
import AWSCredentials from '../../../config/migrator.js'

export function textInputValidator(req: Request, res: Response): void {
  const { type, data } = req.body;
  let result: Array<Object | string> = []
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
  let result: Array< Array< Object | string >> | unknown = []

  const busboy = new Busboy({ headers: req.headers, limits: { fields: 1, files: 1 } });
  let type :string = '';

  busboy.on('field', (fieldname, value) => {
    if (fieldname !== 'type' || !value) {
      res.json({ result: `Incorrect field name: ${fieldname}`})
      return
    }
    type = value;
  })
  busboy.on('file', async (fieldname, file, _1, _2, mimetype) => {
    if (fieldname !== 'file') {
      res.json({ result: `Incorrect field name: ${fieldname}`})
      return
    }
    if (mimetype !== 'application/x-gzip') {
      res.json({ result: 'Please upload files only in *.txt.gz format'})
      return
    }
    file.resume()
    result = await asyncValidateStream(file, type)
    res.json({result})
  })
  req.pipe(busboy)
}

async function validateByKey(s3:any, data: any, type: string) {
  const { Name, Contents } = data
  return Promise.all(Contents.map(async (file: any) => {
    const key = file.Key
    const readableStream = s3.getObject({
      Bucket: Name,
      Key: key 
    })
    .createReadStream()
    return asyncValidateStream(readableStream, type)
  }))
}

export async function s3keyValidator(req: Request, res: Response){
  const { type, path } = req.body
  const s3keyParts = path.split('/')
  const bucket = s3keyParts[2]
  const keyPrefix = s3keyParts.slice(3).join('/') + '/' + type.toLowerCase()
  const s3 = new S3(AWSCredentials)

  s3.listObjectsV2({
    Bucket: bucket,
    Prefix: keyPrefix
  }, async (err, data) => {
    if(err) {
      console.log(err)
      return
    }
    const result = await validateByKey(s3, data, type)
    res.json({result})
  })
}
