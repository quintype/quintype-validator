import ajv from 'ajv';

interface ErrorMessage {
  readonly message: string;
  readonly logLevel: "warn" | "error";
  readonly schema?: object;
}

const getErrorMessageFunction = (keyword: String): (error: ajv.ErrorObject, identifier: String, schema: String) => ErrorMessage => {
  switch (keyword) {
    case "additionalProperties":
      return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
        const params = error.params as ajv.AdditionalPropertiesParams
        return {
          "message": `${schema} with id ${identifier} has additional properties ${params.additionalProperty} ${error.dataPath !== '' ? `in ${error.dataPath}` : ''}`,
          "logLevel": "warn"
        };
      }
    case "type":
      return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
        return { "message": `${schema} with id ${identifier} has wrong type for ${error.dataPath}. It ${error.message}`, "logLevel": "error" }
      }
    case "required":
      return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
        return { "message": `${schema} with id ${identifier}  ${error.message}${error.dataPath !== '' ? ` in ${error.dataPath}` : ''}`, "logLevel": "error" }
      }
    case "anyOf":
      return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
        return { "message": `${schema} with id ${identifier} - has  wrong schema in ${error.dataPath}`, "logLevel": "error"}
      }
    case "enum": 
    return(error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
      const params = error.params as  {allowedValues : ReadonlyArray<string>};
      return { "message" : `${schema} with id ${identifier}  ${error.message} in ${error.dataPath} [ ${error.params && params.allowedValues.join(' ')} ]`, "logLevel": "error"}
    }
    default:
      return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
        console.log(error,identifier,schema);
        return { message: error.message || '', "logLevel": "warn" };
      }
  }
}

export function errorParser(errors: ReadonlyArray<ajv.ErrorObject>, identifier: String, schema: String)
  : ReadonlyArray<ErrorMessage> {
  return errors.map(error => {
    return getErrorMessageFunction(error.keyword)(error, identifier, schema)
  });
}