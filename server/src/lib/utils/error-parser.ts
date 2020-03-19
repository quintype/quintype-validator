// import ajv from 'ajv';

interface Error{
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

function fixErrors(errorList: Error): Error {
  if(errorList.additionalProperties) {
    errorList.additionalProperties = errorList.additionalProperties.filter(
      (prop: { [key: string]: string }) => (prop.key !== 'body' && prop.key !== 'story-elements' && prop.key !== 'cards'))
  }  

  // const required = errorList.required.filter(
  //   (prop: { [key: string]: string }) => (prop.key === 'body' && prop.key !== 'story-elements' && prop.key !== 'cards'))
  // )
  return errorList
}

export function errorParser(errors: ReadonlyArray<Error>, identifier: string, schema: string, errorList: Error)
  : Error {
  errorList.dataType = schema
  errors.forEach(error => {
    const {keyword} = error
    const errorParam = getErrorParam(error)
    if(!errorParam) return

    if(!errorList[keyword]) {
      errorList[keyword] = []
    }
    const errorKey = errorList[keyword].find((prop: { [key: string]: string }) => prop.key === errorParam)

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

  return fixErrors(errorList)
}

function getErrorParam(error: Error): string | boolean {
  switch(error.keyword) {
    case 'required':
      return error.params.missingProperty
    case 'additionalProperties':
      return error.params.additionalProperty
    case 'type':
      return error.dataPath.slice(1)
// handle other keyword errors if required
  }
  return false
} 
