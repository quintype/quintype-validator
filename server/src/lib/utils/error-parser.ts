interface Obj{
  [key: string]: any
}

function fixErrors(errorList: Obj): Obj {
  if(errorList.additionalProperties) {
    errorList.additionalProperties = errorList.additionalProperties.filter(
      (prop: { [key: string]: string }) => (prop.key !== 'body' && prop.key !== 'story-elements' && prop.key !== 'cards'))
    
    if(!errorList.additionalProperties.length) {
      delete errorList.additionalProperties
    }
  }  

  if(errorList.required) {
    const requiredProp = errorList.required.filter(
      (prop: { [key: string]: string }) => (prop.key === 'body' || prop.key === 'story-elements' || prop.key === 'cards'))
  
    if(requiredProp.length !== 2 ) {
      errorList.required.push({
        key: 'any one of body, story-elements and cards',
        ids: [... new Set(requiredProp.map((prop: { [key: string]: string }) => prop.ids))]
      })
    }
    errorList.required = errorList.required.filter(
      (prop: Obj) => (prop.key !== 'body' && prop.key !== 'story-elements' && prop.key !== 'cards'))
    
    if(!errorList.required.length) {
      delete errorList.required
    }
  }

  return errorList
}

export function errorParser(errors: ReadonlyArray<Obj>, identifier: string, schema: string, errorList: Obj)
  : Obj {
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

function getErrorParam(error: Obj): string | boolean {
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
