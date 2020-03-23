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
    const keyName = 'any one of body, story-elements and cards'
    const identifier = requiredProp[0].ids[0]
  
    if(requiredProp.length !== 2 ) {
      const errorKey = errorList.required.find((prop: Obj) => prop.key === keyName)

      if(errorKey) {
        errorKey.ids.push(identifier)
      } else {
        errorList.required.push({
          key: keyName,
          ids: [identifier]
        })
      }
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

  return schema === 'Story' ? fixErrors(errorList) : errorList
}

function getErrorParam(error: Obj): string | boolean {
  switch(error.keyword) {
    case 'required':
      return error.params.missingProperty
    case 'additionalProperties':
      return error.params.additionalProperty
    case 'type':
      return (error.dataPath.slice(1) + ':' + error.params.type)
    case 'enum':
      return (error.dataPath.slice(1) + ':' + error.params.allowedValues)
// handle other keyword errors if required
  }
  return false
} 
