interface Obj{
  [key: string]: any
}

function fixErrors(errorList: Obj, identifier: string, failures: number): Obj {
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
    const keyName = 'any one of body, story-elements or cards:Story'
    failures -= requiredProp.length
    
    if(requiredProp.length !== 2) {
      failures += 1
      const errorKey = errorList.required.find((prop: Obj) => prop.key === keyName)
      if(errorKey) {
        errorKey.ids.push(identifier)
      } else {
        errorList.required.unshift({
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

  if (failures) {
    errorList.failed += 1
  } else {
    errorList.successful += 1
    errorList.valid.push(identifier)
  }
  return errorList
}

export function errorParser(errors: ReadonlyArray<Obj>, identifier: string, schema: string, errorList: Obj)
  : Obj {
  let failures = 0

  errors.forEach(error => {
    const {keyword, data} = error
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
      if(error.keyword !== 'additionalProperties' && error.keyword !== 'oldTimestamp') {
        failures += 1
      }
      errorList[keyword].push({
        key: errorParam,
        ids: [identifier],
        data: data
      })
    }
  });

  if (schema === 'Story') {
    return fixErrors(errorList, identifier, failures)
  } else {
    if (failures) {
      errorList.failed += 1
    } else {
      errorList.successful += 1
      errorList.valid.push(identifier)
    }
    return errorList
  }
}

function getErrorParam(error: Obj, schema: string): string | boolean {
  let keyPath = error.dataPath.slice(1) || schema
  keyPath = keyPath.replace(/\/[0-9]+/g, '-ArrayItem')

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
    case 'minLength':
    case 'minItems':
      return (keyPath + ':' + error.params.limit)
    case 'uniqueKey':
    case 'invalidURL':
    case 'invalidEmail':
    case 'authorNamesMismatch':
    case 'invalidHeroImage':
      return (keyPath + ':' + error.params.value)
    case 'invalidTimestamp':
      return (keyPath + ':' + schema)
    case 'oldTimestamp':
      return (keyPath + ':' + schema)
    case 'pattern':
      return (keyPath + ':Invalid-string')
    case 'invalidEncoding':
      return (keyPath + ':' + error.params.value)

// handle other keyword errors if required
  }
  return false
} 
