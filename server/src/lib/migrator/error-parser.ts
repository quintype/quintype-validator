import ajv from 'ajv';

interface ErrorMessage {
  readonly message: string;
  readonly logLevel: 'warn' | 'error';
  readonly schema?: object;
}

const getErrorMessageFunction = (
  keyword: string
): ((
  error: ajv.ErrorObject,
  identifier: string,
  schema: string
) => ErrorMessage) => {
  switch (keyword) {
    case 'additionalProperties':
      return (
        error: ajv.ErrorObject,
        identifier: string,
        schema: string
      ): ErrorMessage => {
        const params = error.params as ajv.AdditionalPropertiesParams;
        return {
          message: `${schema} with id ${identifier} has additional properties ${
            params.additionalProperty
          } ${error.dataPath !== '' ? `in ${error.dataPath}` : ''}`,
          logLevel: 'warn'
        };
      };
    case 'type':
      return (
        error: ajv.ErrorObject,
        identifier: string,
        schema: string
      ): ErrorMessage => {
        return {
          message: `${schema} with id ${identifier} has wrong type for ${error.dataPath}. It ${error.message}`,
          logLevel: 'error'
        };
      };
    case 'required':
      return (
        error: ajv.ErrorObject,
        identifier: string,
        schema: string
      ): ErrorMessage => {
        return {
          message: `${schema} with id ${identifier}  ${error.message}`,
          logLevel: 'error'
        };
      };
    case 'anyOf':
      return (
        error: ajv.ErrorObject,
        identifier: string,
        schema: string
      ): ErrorMessage => {
        console.log(error);
        return {
          message: `${schema} with id ${identifier} - has  wrong schema in ${error.dataPath}`,
          logLevel: 'error',
          schema: error.schema
        };
      };
    default:
      return (
        error: ajv.ErrorObject,
        _identifier: string,
        _schema: string
      ): ErrorMessage => {
        return { message: error.message || '', logLevel: 'warn' };
      };
  }
};

export function errorParser(
  errors: ReadonlyArray<ajv.ErrorObject>,
  identifier: string,
  schema: string
): ReadonlyArray<ErrorMessage> {
  return errors.map(error => {
    return getErrorMessageFunction(error.keyword)(error, identifier, schema);
  });
}
