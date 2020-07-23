const selectOptions = [
  { label: 'Story', value: 'Story' },
  { label: 'Section', value: 'Section' },
  { label: 'Author', value: 'Author' },
  { label: 'Entity', value: 'Entity' },
  { label: 'Tag', value: 'Tag' }
]

const validateOptions = [
  { label: 'Direct text input', value: 'Direct text input' },
  { label: 'File upload', value: 'File upload' },
  { label: 'S3 path', value: 'S3 path' }
]

function createRequest ({ value: validateType }, { value: selectType }, userData) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      keepalive:true
    }
  }
  let requestData
  if (validateType === 'Direct text input' || validateType === 'S3 path') {
    options.headers['Content-Type'] = 'application/json'
    requestData = JSON.stringify({
      type: selectType,
      data: userData
    })
  } else {
    requestData = new FormData()
    requestData.append('type', selectType)
    requestData.append('file', userData)
  }

  options.body = requestData
  return options
}

function formErrorMetadata (dataType, affectedData) {
  const metadata = {}
  if (dataType) {
    metadata.info = `Affected count: ${affectedData.length}. Refer ${dataType.toLowerCase()} with external-id '${affectedData[0]}'.`
  }
  return metadata
}

function createFileErrorMessage (errorType) {
  switch (errorType) {
    case 'type': return 'wrongType'
    case 'required': return 'requiredField'
    case 'wrongEnumValue': return 'wrongValue'
    case 'uniqueKey': return 'duplicateKey'
    default: return errorType
  }
}

function formErrorFile(errorAggregations) {
  let fileString = 'data:application/octet-stream,error-type%2Cpath%2Clog-level%2Cexternal-id%0A'

  for (const errorType in errorAggregations) {
    const logLevel = errorType === 'additionalProperties' ? 'warning' : 'error'
    // eslint-disable-next-line no-loop-func
    errorAggregations[errorType] && errorAggregations[errorType].forEach(error => {
      const errorMessage = createFileErrorMessage(errorType)
      if (error.ids) {
        error.ids.forEach(id => {
          fileString = `${fileString}${errorMessage}%2C${error.key && error.key.replace(/,/g, '/')}%2C${logLevel}%2C${id}%0A`
        })
      } else {
        fileString = `${fileString}${errorMessage}%2C${error.key && error.key.replace(/,/g, '/')}%2C${logLevel}%2C' '%0A`
      }
    })
  }

  return fileString
}

function parseResult (result) {
  const { dataType, total, successful, failed, additionalProperties, type, required, enum: wrongEnumValue, minLength, maxLength, exceptions, minItems, uniqueKey, invalidURL, invalidSlug } = result
  const finalResult = {}
  finalResult.errors = []
  finalResult.warnings = []
  finalResult.successful = []
  finalResult.total = total || 0
  finalResult.successful = successful || 0
  finalResult.failed = failed || 0
  if (result.error) {
    finalResult.errors.push({
      message: `Error:${result.error}`
    })
    return finalResult
  }

  const errorFileLink = formErrorFile({ exceptions, type, required, wrongEnumValue, minLength, maxLength, minItems, uniqueKey, invalidURL, additionalProperties, invalidSlug })
  finalResult.errorFile = errorFileLink
  const pluralKey = dataType === 'Story' ? `${dataType.toLowerCase().slice(0, 4)}ies` : `${dataType.toLowerCase()}s`
  finalResult.dataType = pluralKey

  exceptions && exceptions.forEach(error => {
    const errorObj = {
      message: `Error:${error.key}`
    }
    if (error.ids) {
      errorObj.metadata = { info: error.ids.join(', ') }
    }
    finalResult.errors.push(errorObj)
  })

  maxLength && maxLength.forEach(error => {
    const [key, subPath] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} should have maximum of ${subPath} characters for property '${key}'.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  minLength && minLength.forEach(error => {
    const [key, limit] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} should have minimum of ${limit} character${limit > 1 ? 's' : ''} for property '${key}'.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  minItems && minItems.forEach(error => {
    const [key, limit] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} should have minimum of ${limit} ${limit > 1 ? key : key.slice(0, key.length - 1)}.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  uniqueKey && uniqueKey.forEach(error => {
    const [key, value] = error.key.split(':')
    finalResult.errors.push({
      message: `${key} '${value}' is not unique.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  invalidURL && invalidURL.forEach(error => {
    const [key, value] = error.key.split(':')
    finalResult.errors.push({
      message: `${key} has invalid url '${value}'`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  required && required.forEach(error => {
    let [key, subPath] = error.key.split(':')
    subPath = (subPath === dataType) ? '' : ` in '${subPath}'.`
    finalResult.errors.push({
      message: `${dataType} should have required property '${key}' ${subPath}.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  additionalProperties && additionalProperties.forEach(warning => {
    let [key, subPath] = warning.key.split(':')
    subPath = (subPath === dataType) ? '' : ` in '${subPath}'.`
    finalResult.warnings.push({
      message: `${dataType} has additional property '${key}' ${subPath}.`,
      metadata: formErrorMetadata(dataType, warning.ids)
    })
  })

  type && type.forEach(error => {
    const [key, expectedType] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} has wrong type for property '${key}'. Expected '${expectedType}'.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  wrongEnumValue && wrongEnumValue.forEach(error => {
    const [key, expectedValue] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} has incorrect value for property '${key}'. Allowed values are '${expectedValue.split(',').join(', ')}'.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  invalidSlug && invalidSlug.forEach(error => {
    const [key, value] = error.key.split(':')
    finalResult.errors.push({
      message: `${key} '${value}' is invalid.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  return finalResult
}

export { selectOptions, validateOptions, createRequest, parseResult }
