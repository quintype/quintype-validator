import React, { Component } from 'react'
import Select from '@quintype/em/components/select'
import styles from './migrator.module.css'
import { Button } from '@quintype/em/components/button'
import Heading from './Heading'
import InputField from './InputField'
import { selectOptions, validateOptions, createRequest } from './validator-utils'
import { chunk } from 'lodash'

export default class ValidationForm extends Component {
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

  resultReducer = (accumulator,result) => {
    for(const key in result){
      if(Array.isArray(result[key])){
        if (accumulator[key]){
          accumulator.ids.concat(result[key].ids)
        }
        accumulator[key]=result[key]
      }
    }
    return accumulator
  }

  validateFromS3 = async (requestOptions) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST || ''}/api/get-s3-files`, requestOptions) 
      const fileList = await response.json()
      const validationPromises = [];
      const s3Validations = [];
      for(const files of chunk(fileList, 2)) {
        const s3FileListOption = createRequest(this.state.validateType,this.state.selectType,{
          path: this.state.userData,
          files
        })
        validationPromises.push(
          fetch(`${process.env.REACT_APP_API_HOST || ''}/api/validate?source=S3`, s3FileListOption)
          .then(response=>response.json())
          .then(response=>{console.log('>>>', response); return response;}
        ))
      }
      (await Promise.all(validationPromises)).reduce(this.resultReducer,{})
      this.props.sendData({result: s3Validations})
      return
    } catch(err) {
      this.props.sendData({
        result: err.message
      })
      return
    }
  }

  onValidate = async (e) => {
    e.preventDefault();
    this.props.sendData({
      formEnabled: false
    })

    const options = createRequest(this.state.validateType, this.state.selectType, this.state.userData)
    if (this.state.validateType.value === 'S3 path') {
      this.validateFromS3(options)
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST || ''}/api/validate?source=${this.state.validateType.value.split(' ')[0]}`, options) 
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
