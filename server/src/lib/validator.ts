import ajv from 'ajv';
import fs from 'fs';
import { join } from 'path';
import readline from 'readline';
import { createGenerator, DEFAULT_CONFIG } from 'ts-json-schema-generator';
import zlib from 'zlib';

import {errorParser} from './error-parser';

let schema : {[key:string]: object}= {};

export function generateJsonSchema(filePath: string, interfaceName: string): any {
  if(schema[interfaceName]){
    return schema[interfaceName];
  }
  const config = { ...DEFAULT_CONFIG, path: filePath, type: interfaceName, topRef: true };
  schema[interfaceName] = createGenerator(config).createSchema(interfaceName);
  return schema[interfaceName];
}

export function validateJson(data: object, schema: object): ReadonlyArray<ajv.ErrorObject>|null|undefined {
  const ajvt = new ajv({ verbose: true, jsonPointers: true,allErrors: true});
  const validate = ajvt.compile(schema);
  //const testValidate =
  validate(data);
  // if(testValidate instanceof Promise){
  //   testValidate.then((errorData)=>{console.log(errorData)})
  // }
  // return betterAjvErrors(schema, data, validate.errors, {format: "js"});
  return validate.errors;
}

// function readableError(allErrors: ReadonlyArray<object>): any {
//   if (allErrors) {
//     console.log(allErrors);
//     // return allErrors.map((errorObject: any) => {
//     //   console.error(errorObject.data['external-id'], errorObject.message);
//     // });
//   }
// }

export function validator(type: string, filepattern: string, source: string, data: any): any {
  const typesPath = join(
    __dirname,
    '..',
    '..',
    'node_modules',
    '@quintype',
    'migration-helpers',
    'build',
    'main',
    'lib',
    'editor-types.d.ts'
  );

  if (source === 'direct') {
    const directSchema = generateJsonSchema(typesPath, type);
    const error =  validateJson(data,directSchema);
    if(error){
      return errorParser(error,data['external-id'],type);
    }
    return 'valid'
  } else {
    const directoryPath = join(__dirname, '..', '..', '..', 'output');
    const directoryFiles = fs.readdirSync(directoryPath);
    const filteredFiles = directoryFiles.filter(file => {
      const pattern = new RegExp('^' + filepattern, 'gi');
      return file.match(pattern);
    });
    const jsonSchema = generateJsonSchema(typesPath, type);
    filteredFiles.forEach(filename => {
      const decompressed = fs.createReadStream(join(directoryPath, filename)).pipe(zlib.createGunzip());
      decompressed.on('error', err => {
        console.error('File:', filename, err.message);
      });
      const lineReader = readline.createInterface({
        input: decompressed
      });
      lineReader.on('line', line => {
        const error = validateJson(JSON.parse(line), jsonSchema);
        if(error){
          errorParser(error,data['external-id'],type);
        }
      });
    });
  }
}
