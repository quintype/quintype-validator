interface Obj{
  [key: string]: any
}

function fixErrors(errorList: Obj): Obj {
  if(errorList.additionalProperties) {
    errorList.additionalProperties = errorList.additionalProperties.filter(
      (prop: { [key: string]: string }) => (prop.key !== 'body:Story' && prop.key !== 'story-elements:Story' && prop.key !== 'cards:Story'))

    if(!errorList.additionalProperties.length) {
      delete errorList.additionalProperties
    }
  }  

  if(errorList.required) {
    const requiredProp = errorList.required.filter(
      (prop: { [key: string]: string }) => (prop.key === 'body:Story' || prop.key === 'story-elements:Story' || prop.key === 'cards:Story'))  
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
      (prop: Obj) => (prop.key !== 'body:Story' && prop.key !== 'story-elements:Story' && prop.key !== 'cards:Story'))

    if(!errorList.required.length) {
      delete errorList.required
    }
  }

  return errorList
}

export function errorParser(errors: ReadonlyArray<Obj>, identifier: string, schema: string, errorList: Obj)
  : Obj {
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

  return schema === 'StoryInternal' ? fixErrors(errorList) : errorList
}

function getErrorParam(error: Obj, schema: string): string | boolean {
  let keyPath = error.dataPath.slice(1) || schema
  keyPath = keyPath.replace(/\/[0-9]+/, '')

  switch(error.keyword) {
    case 'required':
      return (error.params.missingProperty + ':' + keyPath)
    case 'additionalProperties':
      return (error.params.additionalProperty + ':' + keyPath)
    case 'type':
      return (keyPath + ':' + error.params.type)
    case 'enum':
      return (keyPath + ':' + error.params.allowedValues)
    case 'maxLength':
      return (keyPath + ':' + error.params.limit)
    case 'minLength':
      return (keyPath + ':' + error.params.limit)
    case 'minItems':
      return (keyPath + ':' + error.params.limit)
// handle other keyword errors if required
  }
  return false
} 
