import React from 'react'
import { TextArea } from '@quintype/em/components/text-area'
import { FileUpload } from "@quintype/em/components/file-upload"

export default function InputField({validateType, onInput, userData}) {
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