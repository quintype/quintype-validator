import { Request, Response } from "express";
import path, { join } from 'path';
import split2 from 'split2'
import Busboy from 'busboy'
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
  

