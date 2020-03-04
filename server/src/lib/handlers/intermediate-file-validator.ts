import { Request, Response } from "express";
import path, { join } from 'path';
import split2 from 'split2'
import Busboy from 'busboy'
import S3 from 'aws-sdk/clients/s3'
import zlib from 'zlib'
import * as validator from '../utils/validator';

const typesPath = join(
    path.dirname(require.resolve('@quintype/migration-helpers')),
    'lib',
    'editor-types.d.ts'
  );

export function textInputValidator(req: Request, res: Response): void {
  const { type, data } = req.body;
  let result: Object = {}
  try {
    result = validator.validator(type, typesPath, JSON.parse(data));
  } catch (error) {
    result = 'Please provide a single valid JSON input'
  }
  res.json({
   result
  });
}

export function fileValidator(req: Request, res: Response): void {
    let result: any[] = []

  const busboy = new Busboy({ headers: req.headers, limits: { fields: 1, files: 1 } });
  let type :any = undefined;

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
    file
    .pipe(zlib.createGunzip())
    .on('error', (err) => {
      res.json({ result: 'Error :' + err.message })
      return
    })
    .pipe(split2(/\r?\n+/,JSON.parse))
    .on('data', (obj) => {
      result.push(validator.validator(type, typesPath, obj))
    })
    .on('end', () => {
      res.json({result})
    })
  })
  req.pipe(busboy)
}

function checkFile(s3:any, bucket: any, file: any, type: string) {
  return new Promise((resolve, reject) => {
    let fileData: any[] = []
    const key = file.Key
    let result: any = {}
    s3.getObject({
      Bucket: bucket,
      Key: key 
    })
    .createReadStream()
    .on('error', (e: any) => {
      reject(e)
    })
    .pipe(zlib.createGunzip())
    .pipe(split2(/\r?\n+/,JSON.parse))
    .on('data', (obj: any) => {
      fileData.push(validator.validator(type, typesPath, obj))
    })
    .on('end', () => {
      result[key] = fileData
      resolve(result)
    })
  })
}
async function validateByKey(s3:any, data: any, type: string) {
  const { Name, Contents } = data
  let result: any[] = []
  await Promise.all(Contents.map(async (content: any) => {
    result.push(await checkFile(s3, Name, content, type))
  }))
  return result
}
export function s3keyValidator(req: Request, res: Response){
  const s3 = new S3()
  const type = req.body.type
  const s3keyParts = req.body.path.split('/')
  const bucket = s3keyParts[0]
  const keyPrefix = s3keyParts.slice(1).join('/') + '/' + type.toLowerCase()
  let result: any = []
  s3.listObjectsV2({
    Bucket: bucket,
    Prefix: keyPrefix
  }, async (err, data) => {
    if(err) {
      console.log(err)
      return
    }
    result = await validateByKey(s3, data, type)
    res.json({result})
  })
}

  

