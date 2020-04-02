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
  const { dataType, total, failed, successful, valid, additionalProperties, type, required, enum: wrongValue } = result
  finalResult.stats = {
    total,
    successful,
    valid
  }
  finalResult.failed = failed
  finalResult.errors = []
  finalResult.warnings = []
  let key = ''
  let subPath = ''

  required.forEach(error => {
    [ key, subPath ] = error.key.split(':')
    subPath = (subPath === dataType) ? '' : ' in ' + subPath
    finalResult.errors.push({
      message: dataType + ' should have required property ' + key + subPath
    })
  })

//   additionalProperties.forEach(warning => {
//     finalResult.warnings.push({
//       message: dataType + ' should have required property ' + key + subPath
//     })
//   })

  return finalResult
}

export { selectOptions, validateOptions, createRequest, parseResult }
