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

function formErrorMetadata (dataType, affectedData, effect = 'Affected') {
  let metadata = {}
  const link = 'data:text/plain;charset=utf-8,'

  if(dataType) {
    metadata.affectedCount = `Affected ${dataType.toLowerCase()} count: ${affectedData.length}.`
    metadata.example = `Example: ${affectedData[0]}`
  }

  metadata.affected = <a href={link + encodeURIComponent(affectedData.join(','))} download='external-ids.txt'>{effect} externals ids</a>

  return metadata
}

function parseResult (result) {
  let finalResult = {}
  const { dataType, total, failed, successful, valid, additionalProperties, type, required, enum: wrongEnumValue } = result

  const pluralKey =  dataType === 'Story' ? `${dataType.toLowerCase().slice(0, 4)}ies` : `${dataType.toLowerCase()}s`
  finalResult.failed = `${failed} ${pluralKey} failed.`
  finalResult.errors = []
  finalResult.warnings = []
  finalResult.successful = []

  if(valid) {
    finalResult.successful.push({
      message: `${successful} out of ${total} ${pluralKey} are valid.`,
      metadata: formErrorMetadata('', valid, 'Valid')
    })
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
