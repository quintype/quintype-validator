import { Request, Response } from "express";
import path, { join } from 'path';
import split2 from 'split2'
import Busboy from 'busboy'
import S3 from 'aws-sdk/clients/s3'
import zlib from 'zlib'
import * as validator from '../utils/validator'
import { AWSCredentials } from "../../config"

const typesPath = join(
    path.dirname(require.resolve('@quintype/migration-helpers')),
    'lib',
    'editor-types.d.ts'
  );

export function textInputValidator(req: Request, res: Response): void {
  const { type, data } = req.body;
  let result: any = {}
  try {
    result = validator.validator(type, typesPath, JSON.parse(data));
  } catch (error) {
    result = {Error: 'Please provide a single valid JSON input'}
  }
  res.json({
   result
  });
}

function asyncReadStream(file: any, type: string) {
  return new Promise((resolve, reject) => {
    let result: any = []
    file
    .pipe(zlib.createGunzip())
    .pipe(split2(/\r?\n+/,JSON.parse))
    .on('data', (obj: any) => {
      result.push(validator.validator(type, typesPath, obj))
    })
    .on('end', () => {
      resolve(result)
    })
    .on('error', (e: any) => {
      reject(e)
    })
  })
}

export function fileValidator(req: Request, res: Response): void {
  let result: any = []

  const busboy = new Busboy({ headers: req.headers, limits: { fields: 1, files: 1 } });
  let type :any = undefined;

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
    result = await asyncReadStream(file, type)
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
    return asyncReadStream(readableStream, type)
  }))
}

export async function s3keyValidator(req: Request, res: Response){
  const { type, path } = req.body
  const s3keyParts = path.split('/')
  const bucket = s3keyParts[0]
  const keyPrefix = s3keyParts.slice(1).join('/') + '/' + type.toLowerCase()
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
