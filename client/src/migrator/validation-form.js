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
  { label: 'File Upload', value: 'File Upload'}
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

  onInput = userData => {
    this.setState({ userData });
  };

  onValidate = async (e) => {
    e.preventDefault();
    this.props.sendData({
      formEnabled: false
    })

    const data = {
      type: this.state.selectType.value,
      data: this.state.userData
    };
   
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST || ''}/api/validate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        }) 

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
            case 'File Upload' : 
            return (
            <FileUpload
              fieldLabel='Upload File'
              placeholder='Choose file'
              uploadFile={onInput}
            />)
          default : return null
        }
      })()}
    </>
  )
}