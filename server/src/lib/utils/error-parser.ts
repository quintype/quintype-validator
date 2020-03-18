// import ajv from 'ajv';

interface ErrorList{
  [key: string]: any
}

// interface ErrorMessage {
//   readonly message: string;
//   readonly logLevel: "warn" | "error";
//   readonly schema?: object;
// }

// const getErrorMessageFunction = (keyword: String): (error: ajv.ErrorObject, identifier: String, schema: String) => ErrorMessage => {
//   switch (keyword) {
//     case "additionalProperties":
//       return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
//         const params = error.params as ajv.AdditionalPropertiesParams
//         console.log(error)
//         return {
//           "message": `${schema} with id ${identifier} has additional properties ${params.additionalProperty} ${error.dataPath !== '' ? `in ${error.dataPath}` : ''}`,
//           "logLevel": "warn"
//         };
//       }
//     case "type":
//       return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
//         console.log(error)
//         return { "message": `${schema} with id ${identifier} has wrong type for ${error.dataPath}. It ${error.message}`, "logLevel": "error" }
//       }
//     case "required":
//       return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
//         return { "message": `${schema} with id ${identifier}  ${error.message}${error.dataPath !== '' ? ` in ${error.dataPath}` : ''}`, "logLevel": "error" }
//       }
//     case "anyOf":
//       return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
//         return { "message": `${schema} with id ${identifier} - has  wrong schema in ${error.dataPath}`, "logLevel": "error"}
//       }
//     case "enum": 
//     return(error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
//       const params = error.params as  {allowedValues : ReadonlyArray<string>};
//       return { "message" : `${schema} with id ${identifier}  ${error.message} in ${error.dataPath} [ ${error.params && params.allowedValues.join(' ')} ]`, "logLevel": "error"}
//     }
//     default:
//       return (error: ajv.ErrorObject, identifier: String, schema: String): ErrorMessage => {
//         console.log(error,identifier,schema);
//         return { message: error.message || '', "logLevel": "warn" };
//       }
//   }
// }

// export function errorParser(errors: ReadonlyArray<ajv.ErrorObject>, identifier: String, schema: String)
//   : ReadonlyArray<ErrorMessage> {
//   return errors.map(error => {
//     return getErrorMessageFunction(error.keyword)(error, identifier, schema)
//   });
// }

export function errorParser(errors: ReadonlyArray<any>, identifier: String, schema: String, errorList: ErrorList)
  : ErrorList {
  errorList.dataType = schema
  errors.forEach(error => {
    const {keyword} = error
    if(!errorList[keyword]) {
      errorList[keyword] = []
    }
    const errorParam = getErrorParam(error)
    const errorKey = errorList[keyword].find((prop: { [key: string]: any }) => prop.key === errorParam)

    if(errorKey) {
      if(!errorKey.ids.includes(identifier)) {
        errorKey.ids.push(identifier)
      }
    } else {
      errorList[keyword].push({
        key: errorParam,
        ids: [identifier]
      })
    }
  });
  if(errorList.additionalProperties) {
    errorList.additionalProperties = errorList.additionalProperties.filter(
      (prop: { [key: string]: any }) => (prop.key !== 'body' && prop.key !== 'story-elements' && prop.key !== 'cards'))
  }
  return errorList
}

function getErrorParam(error: { [key: string]: any }): any {
  switch(error.keyword) {
    case 'required':
      return error.params.missingProperty
    case 'additionalProperties':
      return error.params.additionalProperty
    case 'type':
      return error.dataPath.slice(1)
  }
  return 'test'
} 
