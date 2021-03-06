import ajv from 'ajv';
import { createGenerator, DEFAULT_CONFIG } from 'ts-json-schema-generator';
import { errorParser } from './error-parser';
import zlib from 'zlib'
import split2 from 'split2'
import path, { join } from 'path';
import { parse, HTMLElement } from 'node-html-parser'
import { URL } from 'url';
import { validate } from 'validate.js';
const chardet = require('chardet');

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

function validateTimestamp(data: {[key: string]: any}, dateKeys: Array<string>, errors:Array<ajv.ErrorObject>) {
  const currentTimestamp = Date.now()
  dateKeys.forEach(key => {
    if(Number.isInteger(data[key])) {
      if(data[key] > currentTimestamp || data[key] < 0) {
        errors.push({
          keyword: 'invalidTimestamp',
          dataPath: `/${key}`,
          schemaPath: '',
          params: {
            value: data[key]
          }
        })
      }

      else if(data[key] < 631132200000) {
        errors.push({
          keyword: 'oldTimestamp',
          dataPath: `/${key}`,
          schemaPath: '',
          params: {
            value: data[key]
          }
        })
      }
    }
  })
  return errors
}

function validateAuthor(author: any, errors: Array<ajv.ErrorObject>) {
  const constraints = {
    from: {
      email: true
    }
  }
  if(author && author.email && validate({from: author.email}, constraints)) {
    errors.push({
      keyword: 'invalidEmail',
      dataPath: '/email',
      schemaPath: '',
      params: {
        value: author.email
      }
    })
  }
  if(author.username && (author.username !== author.name)) {
    errors.push({
      keyword: 'authorNamesMismatch',
      dataPath: '/author',
      schemaPath: '',
      data: author,
      params: {
        value: author.username
      }
    })
  }
  return errors
}

function validateHeroImage(heroImage: string, errors: Array<ajv.ErrorObject>) {
  const constraints = {
    website: {
      url: {
        allowLocal: true
      }
    }
  };
  if (validate({ website: heroImage }, constraints)) {
    errors.push({
      keyword: 'invalidHeroImage',
      dataPath: '/TemporaryheroImageUrl',
      schemaPath: '',
      params: {
        value: heroImage
      }
    });
  }
  return errors;
}

function validateEncoding(data: string, errors: Array<ajv.ErrorObject>) {
  const encoding = chardet.detect(Buffer.from(JSON.stringify(data)))
  if ( encoding !== 'ISO-8859-1' && encoding !== 'UTF-8') {
    errors.push({
      keyword: 'invalidEncoding',
      dataPath: '/',
      schemaPath: '',
      params: {
        value: encoding
      }
    })
  }
  return errors;  
}

export function validateJson(
  data: {[key: string]: any},
  schema: object,
  uniqueSlugs: Set<string>,
  type: string
): ReadonlyArray<ajv.ErrorObject> {
  const ajvt = new ajv({ verbose: true, jsonPointers: true, allErrors: true });
  const validate = ajvt.compile(schema);
  validate(data);
  let finalErrors:Array<ajv.ErrorObject> = []
  if(data.slug) {
    finalErrors = validateSlug(data.slug,uniqueSlugs,validate.errors || [])
  }
  if(data.body) {
    finalErrors = finalErrors.concat(validateBody(data.body, validate.errors || []))
  }

  const dateKeys = Object.keys(data).filter(key => key.includes('published-at'))
  if(dateKeys.length) {
    finalErrors = finalErrors.concat(validateTimestamp(data, dateKeys, validate.errors || []))
  }

  if (data.authors && Array.isArray(data.authors)) {
    data.authors.map(
      (author: object) =>
        (finalErrors = finalErrors.concat(
          validateAuthor(author, validate.errors || [])
        ))
    )
  }

  if ( type === 'Author' ) {
    finalErrors = finalErrors.concat(
      validateAuthor(data, validate.errors || [])
    );
  }

  if(data['temporary-hero-image-url']) {
    finalErrors = finalErrors.concat(validateHeroImage(data['temporary-hero-image-url'], validate.errors || []));
  }

  finalErrors = finalErrors.concat(validateEncoding(JSON.stringify(data), validate.errors || []))
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
  if(!result.valid) {
    result.valid = []
  }

  const directSchema = generateJsonSchema(typesPath, type);
  const error = validateJson(data, directSchema, uniqueSlugs, type);

  if (error.length) {
    return errorParser(error, data['external-id'], type, result);
  }

  result.successful += 1
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