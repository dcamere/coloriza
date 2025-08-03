import React, { useState } from 'react'
import './FileUploader.scss'
import Loader from '../Loader/Loader'
import { BsXLg } from 'react-icons/bs'

export const SingleFile = (props) => {
  const { text, isLoading, selectedFiles, setSelectedFiles, setValue } = props

  const handleDelete = (name) => {
    setSelectedFiles((selectedFiles) => {
      const arr = selectedFiles.filter((item) => item.name !== name)
      setValue('uploads', JSON.stringify(arr))
      return arr
    })
  }

  return (
    <div className="single-file">
      {!isLoading && <img src="upload-placeholder.png" alt={text} />}
      <span>{text}</span>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="single-file__close"
          onClick={() => {
            handleDelete(text)
          }}
        >
          <BsXLg />
        </div>
      )}
    </div>
  )
}

export default SingleFile
