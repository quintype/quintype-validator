import React, { Component } from 'react'
import Select from '@quintype/em/components/select'
import styles from './migrator.module.css'
import { Button } from '@quintype/em/components/button'
import { TextArea } from '@quintype/em/components/text-area'
import { FileUpload } from "@quintype/em/components/file-upload"
import { Heading } from './migrator'

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

export class ValidationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      validateType: null,
      selectType: null,
      userData: ''
    }
  }

  onChangeValidateType = validateType => {
    this.setState({ validateType });
  };

  onChangeSelectType = selectType => {
    this.setState({ selectType });
  };

  onInput = (textInput, fileInput) => {
    const userData = textInput || fileInput || ''
    this.setState({ userData });
  };

  onValidate = async (e) => {
    e.preventDefault();
    this.props.sendData({
      formEnabled: false
    })

    let options, requestUrl
    switch(this.state.validateType.value) {
      case 'Direct text input':
        const requestBody = JSON.stringify({
          type: this.state.selectType.value,
          data: this.state.userData
        })
        requestUrl = '/api/validate'
        options = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: requestBody
        }          
        break

      case 'File Upload':
        let requestData = new FormData()
        requestData.append('file', this.state.userData)
        requestData.append('type', this.state.selectType.value)
        requestUrl = '/api/validate-file'
        options = {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          },
          body: requestData
        }
        break
      
        case 'S3 path': 
        const requests3 = JSON.stringify({
          type: this.state.selectType.value,
          path: this.state.userData
        })
        requestUrl = '/api/validate-s3'
        options = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: requests3,
        }
        break
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST || ''}${requestUrl}`, options) 
      const result = await response.json()
      this.props.sendData({result})
      } catch(err) {
        this.props.sendData({
          result: err.message
        })
      }
  }

  render() {
    const {
      validateType,
      selectType,
      userData
    } = this.state
    const submitEnabled = validateType && selectType && userData
  
    return (
      <>
      <Heading />
      <div className={styles.container}>
        <Select
          label='Select Type'
          options={selectOptions}
          value={selectType}
          onChange={this.onChangeSelectType}
        />
        <Select
          label='Validate by'
          options={validateOptions}
          value={validateType}
          onChange={this.onChangeValidateType}
        />
        <InputField
          userData={userData}
          validateType={validateType}
          onInput={this.onInput}
          />
        <Button
          type='primary'
          onClick={this.onValidate}
          disabled={!submitEnabled}
        >
          Validate
        </Button>
      </div>
    </>
    )
  }
}

function InputField({validateType, onInput, userData}) {
  return validateType && (
    <>
      {(() => {
        switch(validateType.value) {
          case 'Direct text input' : 
            return (
            <TextArea
              label='Enter the Markup to validate:'
              onChange={onInput}
              value={userData}
              placeholder='Enter the JSON data'
            />)
            case 'File upload' : 
            return (
            <FileUpload
              fieldLabel='Upload File'
              placeholder='Choose file (only *.txt.gz)'
              accepts='application/x-gzip'
              size={3000000}
              uploadFile={onInput}
            />)
            case 'S3 path' : 
            return (
              <TextArea
              label='Type url here'
              onChange={onInput}
              value={userData}
              placeholder='Enter S3 path'
            />)
          default : return null
        }
      })()}
    </>
  )
}