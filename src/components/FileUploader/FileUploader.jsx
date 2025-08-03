import React, { useRef, useState, useEffect } from 'react'
import './FileUploader.scss'
import SingleFile from './SingleFile'
import { CgSoftwareUpload } from 'react-icons/cg'
import { useFormContext } from 'react-hook-form'

export const FileUploader = (props) => {
  const { getValues } = useFormContext().methods
  const formData = getValues()
  const prevUploads = formData['uploads'] ? JSON.parse(formData['uploads']) : []
  const {
    name,
    setValue,
    apiCall,
    text,
    isAnyElementLoading,
    setIsAnyElementLoading,
  } = props

  const inputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState(prevUploads)

  const handleOnChange = async (event) => {
    const file = event.target.files[0]

    if (selectedFiles.length >= 5) {
      alert('Solo puedes seleccionar un máximo de 5 archivos.')
      return
    }

    setSelectedFiles((selectedFiles) => [
      ...selectedFiles,
      { name: file.name, loading: true },
    ])

    setIsAnyElementLoading(true)

    if (typeof apiCall === 'function') {
      try {
        //   TODO: Temp for hardcore flow
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiCall(formData)

        if (response) {
          setSelectedFiles((selectedFiles) => {
            const arr = selectedFiles.filter(
              (item) => item.name !== response.name,
            )
            setValue('uploads', JSON.stringify([...arr, response]))
            return [...arr, response]
          })
          setIsAnyElementLoading(false)
        }
      } catch (error) {
        setSelectedFiles((selectedFiles) => {
          const arr = selectedFiles.filter((item) => item.name !== file.name)
          setValue('uploads', JSON.stringify(arr))
          return arr
        })
        setIsAnyElementLoading(false)
        console.warn(error)
        throw error
      }
    }
  }

  // useEffect(() => {
  //   selectedFiles.map((item) => {
  //     console.log(item?.loading)
  //   })
  // }, [selectedFiles])

  return (
    <>
      <div className="file-uploader" onClick={() => inputRef?.current?.click()}>
        {text}
        <CgSoftwareUpload />
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => typeof apiCall === 'function' && handleOnChange(e)}
        />
      </div>

      <div className="selected-files">
        {selectedFiles.map((file, index) => (
          <div key={index} className="selected-file">
            <SingleFile
              setValue={setValue}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              text={file.name}
              isLoading={file.loading}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default FileUploader
