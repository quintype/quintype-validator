import ajv from 'ajv';
import { createGenerator, DEFAULT_CONFIG } from 'ts-json-schema-generator';
import { errorParser } from './error-parser';
import zlib from 'zlib'
import split2 from 'split2'
import path, { join } from 'path';

const schemas: { [key: string]: object } = {};

export const typesPath = join(
  path.dirname(require.resolve('@quintype/migration-helpers')),
  'lib',
  'editor-types.d.ts'
);

export function generateJsonSchema(
  filePath: string,
  interfaceName: string
): any {
  if (schemas[interfaceName]) {
    return schemas[interfaceName];
  }
  const config = {
    ...DEFAULT_CONFIG,
    path: filePath,
    type: interfaceName,
    topRef: true
  };
  schemas[interfaceName] = createGenerator(config).createSchema(interfaceName);
  return schemas[interfaceName];
}

export function validateJson(
  data: object,
  schema: object
): ReadonlyArray<ajv.ErrorObject> | null | undefined {
  const ajvt = new ajv({ verbose: true, jsonPointers: true, allErrors: true });
  const validate = ajvt.compile(schema);
  validate(data);
  return validate.errors;
}

export function validator(type: string, typesPath: string, data: any, errorList: {[key: string]: any} = {}): any {
  const directSchema = generateJsonSchema(typesPath, type);
  const error = validateJson(data, directSchema);
  if (error) {
    return errorParser(error, data['external-id'], type, errorList);
  }
  if(!errorList.valid) {
    errorList.valid = []
  }
  errorList.valid.push(data['external-id'])
  return errorList
}

export function asyncValidateStream(file: any, type: string, result: {[key: string]: any} = {}) {
  return new Promise((resolve, reject) => {
    file
    .pipe(zlib.createGunzip()).on('error', () => {
      resolve('Please upload files only in *.txt.gz format')
      return
    })
    .pipe(split2(/\r?\n+/,(obj) => {
      try {
        return JSON.parse(obj)
      } catch(err) {
        resolve('Please upload files with valid JSONs')
      return
      }
    }))
    .on('data', (obj: Object) => {
      result = validator(type, typesPath, obj, result)
    })
    .on('end', () => {
      resolve(result)
    })
    .on('error', (e: Error) => {
      reject(e)
    })
  })
}