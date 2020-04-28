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

function isUniqueSlug(data: {slug: string}, uniqueSlugs: Set<string>) {
  if(uniqueSlugs.has(data.slug)) return false
  uniqueSlugs.add(data.slug)
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

function isValidUrl(url: string) {
  try {
    new URL(url)
    return false
  } catch {
    return url
  }
}

function checkUrl(htmlTree: any): boolean | string {
  if(htmlTree.tagName === 'img') {
    return isValidUrl(htmlTree.rawAttributes.src)
  }  

  const images = htmlTree.childNodes.filter((element: HTMLElement) => element.tagName === 'img');
  if(images.length > 0) {
    images.forEach((image: HTMLElement) => {
      const url = image.rawAttributes.src
      try {
        new URL(url)
        return false
      } catch {
        return {
          'invalid-url': url
        }
      }
    });
  }

  let result: boolean | string = false
  for(let child of htmlTree.childNodes) {
    result = checkUrl(child)
    if(result) {
      return result
    }
  }
  return result
}

function validateBody(body: string, errors: Array<ajv.ErrorObject> | undefined | null): ReadonlyArray<ajv.ErrorObject> | undefined | null{
  const htmlTree = parse(body);
  const result = checkUrl(htmlTree)
  console.log(result)
  return errors
}

export function validateJson(
  data: {[key: string]: any},
  schema: object,
  uniqueSlugs: Set<string>
): ReadonlyArray<ajv.ErrorObject> | null | undefined {
  const ajvt = new ajv({ verbose: true, jsonPointers: true, allErrors: true });
  const validate = ajvt.compile(schema);
  validate(data);
  if(data.slug) {
    const isUnique = isUniqueSlug(data as {slug: string}, uniqueSlugs)
    if(!isUnique) {
      if(!validate.errors) {
        validate.errors = []
      }
      validate.errors.push({
        keyword: 'uniqueKey',
        dataPath: '/slug',
        schemaPath: '',
        params: {
          value: data.slug
        }
      })
    }
  }
  validateBody(data.body, validate.errors);
  return validate.errors;
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
  if (error) {
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