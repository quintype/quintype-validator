import React from "react";
const selectOptions = [
  { label: 'Story', value: 'Story' },
  { label: 'Section', value: 'Section' },
  { label: 'Author', value: 'Author' },
  { label: 'Entity', value: 'Entity' },
  { label: 'Tag', value: 'Tag' }
]
    
const validateOptions = [
  { label: 'Direct text input', value: 'Direct text input' },
  { label: 'File upload', value: 'File upload'},
  { label: 'S3 path', value: 'S3 path'}
]

function createRequest ({value: validateType}, {value: selectType}, userData) {
  let options = {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  }
  let requestData
  if(validateType === 'Direct text input' || validateType === 'S3 path') {
    options.headers['Content-Type'] = 'application/json'
    requestData = JSON.stringify({
      type: selectType,
      data: userData
    })
  } else {
    requestData = new FormData()
    requestData.append('file', userData)
    requestData.append('type', selectType)
  }

  options.body = requestData
  return options
}

function parseResult (result) {
  let finalResult = {}
  const { dataType, total, failed, successful, valid, additionalProperties, type, required, enum: wrongEnumValue } = result

  const link = 'data:text/plain;charset=utf-8,'
  finalResult.failed = failed
  finalResult.errors = []
  finalResult.warnings = []
  finalResult.successful = []

  valid && finalResult.successful.push({
    message: `${successful} out of ${total} ${dataType.toLowerCase()}s are valid.`,
    metadata: <a href={link + encodeURIComponent(valid.join(','))} download="valid-external-ids.txt">Valid externals ids</a>
  })

  required && required.forEach(error => {
    let [ key, subPath ] = error.key.split(':')
    subPath = (subPath === dataType) ? '' : ` in ${subPath}`
    finalResult.errors.push({
      message: `${dataType} should have required property ${key} ${subPath}`,
      metadata: {
        affectedCount: `Affected ${dataType.toLowerCase()} count: ${error.ids.length}`,
        example: `Example: ${error.ids[0]}`,
        affected: <a href={link + encodeURIComponent(error.ids.join(','))} download="affected-external-ids.txt">Affected external ids</a>
      }
    })
  })

  additionalProperties && additionalProperties.forEach(warning => {
    let [ key, subPath ] = warning.key.split(':')
    subPath = (subPath === dataType) ? '' : ` in ${subPath}`
    finalResult.warnings.push({
      message: `${dataType} has additional property ${key} ${subPath}`,
      metadata: {
        affectedCount: `Affected ${dataType.toLowerCase()} count: ${warning.ids.length}`,
        example: `Example: ${warning.ids[0]}`,
        affected: <a href={link + encodeURIComponent(warning.ids.join(','))} download="affected-external-ids.txt">Affected external ids</a>
      }
    })
  })

  type && type.forEach(error => {
    const [ key, expectedType ] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} has wrong type for property ${key}. Expected ${expectedType}`,
      metadata: {
        affectedCount: `Affected ${dataType.toLowerCase()} count: ${error.ids.length}`,
        example: `Example: ${error.ids[0]}`,
        affected: <a href={link + encodeURIComponent(error.ids.join(','))} download="affected-external-ids.txt">Affected external ids</a>
      }
    })
  })

  wrongEnumValue && wrongEnumValue.forEach(error => {
    const [ key, expectedValue ] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} has incorrect value for property ${key}. Allowed values are ${expectedValue.split(',').join(', ')}`,
      metadata: {
        affectedCount: `Affected ${dataType.toLowerCase()} count: ${error.ids.length}`,
        example: `Example: ${error.ids[0]}`,
        affected: <a href={link + encodeURIComponent(error.ids.join(','))} download="affected-external-ids.txt">Affected external ids</a>
      }
    })
  })

  return finalResult
}

export { selectOptions, validateOptions, createRequest, parseResult }
