import ajv from 'ajv';
import { createGenerator, DEFAULT_CONFIG } from 'ts-json-schema-generator';
import { errorParser } from './error-parser';
import zlib from 'zlib'
import split2 from 'split2'
import path, { join } from 'path';
import { parse, HTMLElement } from 'node-html-parser'
import { URL } from 'url';

const schemas: { [key: string]: object } = {};

export const typesPath = join(
  path.dirname(require.resolve('@quintype/migration-helpers')),
  'lib',
  'editor-types.d.ts'
);

function isUniqueSlug(slug: string, uniqueSlugs: Set<string>) {
  if(uniqueSlugs.has(slug)) return false
  uniqueSlugs.add(slug)
  return true
}

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

function checkUrl(htmlTree: any): void {
  if(['img', 'video', 'iframe'].find(tag => tag === htmlTree.tagName)) {
    new URL(htmlTree.rawAttributes.src)
  }  
  htmlTree.childNodes.forEach((element: HTMLElement) => {
    checkUrl(element)
  })
}

function validateBody(body: string, errors: Array<ajv.ErrorObject>) {
  const htmlTree = parse(body);
  try{
    checkUrl(htmlTree)
  } catch(e) {
    const value = e.message.split(':')[1]
    const invalidURL = {
      keyword: 'invalidURL',
      dataPath: '/body',
      schemaPath: '',
      params: {
        value
      }}
    errors.push(invalidURL)
  }
  return errors
}

function validateSlug(slug: string, uniqueSlugs: Set<string>, errors: Array<ajv.ErrorObject>) {
  if(!isUniqueSlug(slug,uniqueSlugs)) {
    errors.push({
      keyword: 'uniqueKey',
      dataPath: '/slug',
      schemaPath: '',
      params: {
        value: slug
      }
    })
  }
  return errors
}

export function validateJson(
  data: {[key: string]: any},
  schema: object,
  uniqueSlugs: Set<string>
): ReadonlyArray<ajv.ErrorObject> {
  const ajvt = new ajv({ verbose: true, jsonPointers: true, allErrors: true });
  const validate = ajvt.compile(schema);
  validate(data);
  let finalErrors:Array<ajv.ErrorObject> = []
  if(data.slug) {
    finalErrors = validateSlug(data.slug,uniqueSlugs,validate.errors || [])
  }
  if(data.body) {
    finalErrors = validateBody(data.body, validate.errors || [])
  }
  return finalErrors.concat(validate.errors || []);
}

export function validator(type: string, data: {[key: string]: any}, result: {[key: string]: any}, uniqueSlugs: Set<string>): {[key: string]: any} {
  result.total = result.total ? result.total+1 : 1

  if(result.dataType === undefined) {
    result.dataType = type
  }
  if(result.successful === undefined){
    result.successful = 0
    result.failed = 0
  }
  const directSchema = generateJsonSchema(typesPath, type);
  const error = validateJson(data, directSchema, uniqueSlugs);

  if (error.length) {
    result.failed = result.failed + 1
    return errorParser(error, data['external-id'], type, result);
  }
  if(!result.valid) {
    result.valid = []
  }
  result.successful = result.successful + 1
  result.valid.push(data['external-id'])
  return result
}

export function asyncValidateStream(file: any, type: string, result: {[key: string]: any}, uniqueSlugs: Set<string>) {
  result.dataType = type
  return new Promise((resolve, reject) => {
    file
    .pipe(zlib.createGunzip()).on('error', () => {
      reject('invalidGzip')
    })
    .pipe(split2(/\r?\n+/,(obj) => {
      try {
        return JSON.parse(obj)
      } catch(err) {
        reject('invalidJSON')
      }
    }))
    .on('data', (obj: Object) => {
      result = validator(type, obj, result, uniqueSlugs)
    })
    .on('end', () => {
      resolve(result)
    })
    .on('error', (e: Error) => {
      reject(e)
    })
  })
}