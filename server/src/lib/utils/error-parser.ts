interface Obj{
  [key: string]: any
}

export function errorParser(errors: ReadonlyArray<Obj>, identifier: string, schema: string, errorList: Obj)
  : Obj {
  errorList.dataType = schema
  errors.forEach(error => {
    const {keyword} = error
    const errorParam = getErrorParam(error, schema)
    if(!errorParam) return

    if(!errorList[keyword]) {
      errorList[keyword] = []
    }
    const errorKey = errorList[keyword].find((prop: Obj) => prop.key === errorParam)

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

  return errorList
}

function getErrorParam(error: Obj, schema: string): string | boolean {
  let keyPath = error.dataPath.slice(1) || schema
  keyPath = keyPath.replace('/0', '')

  switch(error.keyword) {
    case 'required':
      return (error.params.missingProperty + ':' + keyPath)
    case 'additionalProperties':
      return (error.params.additionalProperty + ':' + keyPath)
    case 'type':
      return (keyPath + ':' + error.params.type)
    case 'enum':
      return (keyPath + ':' + error.params.allowedValues)
// handle other keyword errors if required
  }
  return false
} 
