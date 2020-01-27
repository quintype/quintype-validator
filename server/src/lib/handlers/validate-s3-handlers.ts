import split2 from 'split2';
import { Transform } from 'stream';
import { isUndefined } from 'util';
import { join } from 'path';
import * as validator from './validator';
import { Request, Response } from "express";
const AWS = require('aws-sdk');
var zlib = require('zlib');

const typesPath = join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'node_modules',
  '@quintype/migration-helpers',
  'build',
  'main',
  'lib',
  'editor-types.d.ts'
);
export async function AWSHandler( req: Request, res: Response) {
  const { type } = req.body;
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  var options = {
    Bucket: 'qt-clients-backup',
    Key: 'prothomalo/prothomalo-Bangala/21-Jan-2020/attributes-story.txt.gz',
   
  };
  
  s3.getObject(options)
    .createReadStream()
    .on('error', (e: any) => {
      e;
    })
    .pipe(zlib.createGunzip())
    .on('error', (e: any) => {
      console.log('error unabel to process the data', e);
    })
    .pipe(split2())
    .pipe(
      new Transform({
        async transform(chunk, _0, cb) {
          if (isUndefined(type)) {
            await new Promise(r => setTimeout(r, 2000));
          }
          const item = JSON.parse(chunk);
          console.log(item, 'item');
          cb(
            null,
            `${JSON.stringify({
              'external-id': item['external-id']
                ? item['external-id']
                : 'missing-id',
              result: validator.validator(type, typesPath, item)
            })}\n`
          );
        }
      })
    )
    .pipe(res);
}

