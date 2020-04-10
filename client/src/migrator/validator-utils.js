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
    requestData.append('type', selectType)
    requestData.append('file', userData)
  }

  options.body = requestData
  return options
}

function formErrorMetadata (dataType, affectedData, effect = 'Affected') {
  let metadata = {}
  const link = 'data:text/plain;charset=utf-8,'

  if(dataType) {
    metadata.info = `Affected count: ${affectedData.length}. Refer ${dataType.toLowerCase()} with external-id '${affectedData[0]}'.`
  }

  metadata.affected = <a href={link + encodeURIComponent(affectedData.join(','))} download='external-ids.txt'>{effect} externals ids</a>

  return metadata
}

function parseResult (result) {
  let finalResult = {}
  const { dataType, total, successful, additionalProperties, type, required, enum: wrongEnumValue, error, errorKeys } = result

  finalResult.errors = []
  finalResult.warnings = []
  finalResult.successful = []
  const pluralKey =  dataType === 'Story' ? `${dataType.toLowerCase().slice(0, 4)}ies` : `${dataType.toLowerCase()}s`
  finalResult.total =  `Total ${pluralKey} read: ${total || 0}`
  finalResult.successful = `${successful || 0} out of ${total || 0} ${pluralKey} are valid.`

  if(error) {
    const errorObject = {
      message: error
    }
    if(errorKeys) {
      errorObject.metadata = {example: errorKeys.join(', ')}
    }
    finalResult.errors.push(errorObject)
  }

  required && required.forEach(error => {
    let [ key, subPath ] = error.key.split(':')
    subPath = (subPath === dataType) ? '' : ` in '${subPath}'.`
    finalResult.errors.push({
      message: `${dataType} should have required property '${key}' ${subPath}`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  additionalProperties && additionalProperties.forEach(warning => {
    let [ key, subPath ] = warning.key.split(':')
    subPath = (subPath === dataType) ? '' : ` in '${subPath}'.`
    finalResult.warnings.push({
      message: `${dataType} has additional property '${key}' ${subPath}`,
      metadata: formErrorMetadata(dataType, warning.ids)
    })
  })

  type && type.forEach(error => {
    const [ key, expectedType ] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} has wrong type for property '${key}'. Expected '${expectedType}'.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  wrongEnumValue && wrongEnumValue.forEach(error => {
    const [ key, expectedValue ] = error.key.split(':')
    finalResult.errors.push({
      message: `${dataType} has incorrect value for property '${key}'. Allowed values are '${expectedValue.split(',').join(', ')}'.`,
      metadata: formErrorMetadata(dataType, error.ids)
    })
  })

  return finalResult
}

export { selectOptions, validateOptions, createRequest, parseResult }
