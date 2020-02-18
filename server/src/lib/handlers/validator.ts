import ajv from 'ajv';
import { createGenerator, DEFAULT_CONFIG } from 'ts-json-schema-generator';
import { errorParser } from '../utils/error-parser';

const schemas: { [key: string]: object } = {};

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

export function validator(type: string, typesPath: string, data: any): any {
  const directSchema = generateJsonSchema(typesPath, type);
  const error = validateJson(data, directSchema);
  if (error) {
    return errorParser(error, data['external-id'], type);
  }
  return 'valid';
}