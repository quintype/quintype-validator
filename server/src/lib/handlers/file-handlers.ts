import { Request, Response } from "express";
import Busboy from 'busboy';
import split2 from 'split2';
import { Transform } from "stream";
import { isUndefined } from "util";
import { join } from 'path';
import * as validator from './validator';
import log4js from 'log4js';

const logger = log4js.getLogger();
const typesPath = join(__dirname,
  '..',
  '..',
  '..',
  '..',
  'node_modules',
  '@quintype/migration-helpers',
  'build',
  'main',
  'lib',
  'editor-types.d.ts');

export async function FileHandler(req: Request, res: Response) {
  const busboy = new Busboy({ headers: req.headers, limits: { fields: 1, files: 1 } });
  let type :any = undefined;
  busboy.on('field', (fieldname, value, _0, _1, _2, _3) => {
    if (fieldname !== 'type') {
      return;
    }
    type = value;
  })
  busboy.on('file', (fieldname, file, _1, _2, _3) => {
    if (fieldname !== 'file') {
      // Added if incorrect field 
      res.sendStatus(422);
      file.resume();
      return
    }
    file
      .pipe(split2())
      .pipe(new Transform({
        async transform(chunk, _0,cb) {
          if(isUndefined(type)){
            await new Promise(r => setTimeout(r, 2000));
          }
          const item = JSON.parse(chunk);
          cb(null,`${JSON.stringify({ 'external-id': item['external-id'] ? item['external-id'] : "missing-id" ,result : validator.validator(type, typesPath, item ) })}\n`)
        }
      }))
      .pipe(res);
  })
  busboy.on('finish', () => {
    logger.info("Completed parsing")
  })
  req.pipe(busboy);
}


