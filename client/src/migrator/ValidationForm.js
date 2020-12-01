import React, { Component } from 'react'
import Select from '@quintype/em/components/select'
import { Button } from '@quintype/em/components/button'
import InputField from './InputField'
import { selectOptions, validateOptions, createRequest } from './validator-utils'
import { chunk } from 'lodash'
import { PromiseQueue } from './promise-concurrent-queue'

const promiseQueue = new PromiseQueue(5);
export default class ValidationForm extends Component {

  constructor(props) {
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

  mergeError = (accumulatedErrors, currentErrors) => {
    for (const currentError of currentErrors) {
      let accumulatedError = accumulatedErrors.find(err => err.key === currentError.key)
      if ((typeof currentError === 'object') && accumulatedError) {
        accumulatedError.ids.concat(currentError.ids)
      } else {
        accumulatedErrors.push(currentError)
      }
    }
    return accumulatedErrors
  }

  resultReducer = (accumulator, result) => {
    for (const key in result) {
      if (Array.isArray(result[key])) {
        accumulator[key] = accumulator[key] ? this.mergeError(accumulator[key], result[key]) : result[key];
      }
      else if (typeof result[key] === 'number') {
        accumulator[key] = accumulator[key] ? accumulator[key] + result[key] : result[key]
      } else {
        accumulator[key] = result[key]
      }
    }
    return accumulator
  }

  validateFromS3 = async (requestOptions) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST || ''}/api/get-s3-files`, requestOptions)
      const fileList = await response.json()
      if (fileList.error || fileList.exceptions) {
        this.props.sendData({ result: fileList })
        return
      }
      const validationPromises = [];
      const smallFileList =  fileList.filter(file=>file.size<=1024*1024*2)
      const largeFileList =  fileList.filter(file=>file.size>1024*1024*2)
      for (let files of chunk(smallFileList, 2)) {
        files=files.map(file=>file.key)
        const s3FileListOption = createRequest(this.state.validateType, this.state.selectType, {
          path: this.state.userData,
          files
        })
        validationPromises.push(
          promiseQueue.addPromise(
            fetch ,`${process.env.REACT_APP_API_HOST || ''}/api/validate?source=S3`, s3FileListOption)
            .then((response,rejection )=> {
              if(rejection){
                console.error(rejection);
                throw(rejection);
              }
              return response.json()              
            })
        )
      }
      for (let files of chunk(largeFileList, 1)) {
        files=files.map(file=>file.key)
        const s3FileListOption = createRequest(this.state.validateType, this.state.selectType, {
          path: this.state.userData,
          files
        })
        validationPromises.push(
          promiseQueue.addPromise(
            fetch ,`${process.env.REACT_APP_API_HOST || ''}/api/validate?source=S3`, s3FileListOption)
            .then((response,rejection )=> {
              if(rejection){
                console.error(rejection);
                throw(rejection);
              }
              return response.json()              
            })
        )
      }
      let result = await Promise.all(validationPromises);
      result = result.reduce(this.resultReducer, {})
      this.props.sendData({ result })
      return
    } catch (err) {
      console.log(err);
      this.props.sendData({
        result: {error: err.message}
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
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_HOST || ''}/api/validate?source=${this.state.validateType.value.split(' ')[0]}`, options)
        const result = await response.json()
        this.props.sendData({ result })
      } catch (err) {
        console.log(err);
        this.props.sendData({
          result: {error:err.message}
        })
      }
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
      </>
    )
  }
}
