import React, { useRef, useState, useEffect } from 'react'
import './FileUploader.scss'
import FileItem from './SingleFile'
import { CgSoftwareUpload } from 'react-icons/cg'
import { useFormContext } from 'react-hook-form'
import { useFormPayload } from '../../contexts/FormContext'


export const FileUploader = (props) => {
  const { updatePayload } = useFormPayload()
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
    children,
  } = props

  const inputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState(prevUploads)

  const handleOnChange = async (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Solo puedes seleccionar un máximo de ${maxFiles} archivos.`);
      return;
    }
    setIsAnyElementLoading(true);
    for (const file of files) {
      setSelectedFiles((selectedFiles) => [
        ...selectedFiles,
        { name: file.name, loading: true },
      ]);
      if (typeof apiCall === 'function') {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await apiCall(formData);
          if (response) {
            setSelectedFiles((selectedFiles) => {
              const arr = selectedFiles.filter(
                (item) => item.name !== response.name,
              );
              const updatedFiles = [...arr, response];
              setValue('uploads', JSON.stringify(updatedFiles));
              
              // Actualizar el contexto del payload con los archivos
              updatePayload({
                uploads: updatedFiles
              });
              
              return updatedFiles;
            });
          }
        } catch (error) {
          setSelectedFiles((selectedFiles) => {
            const arr = selectedFiles.filter((item) => item.name !== file.name);
            setValue('uploads', JSON.stringify(arr));
            
            // Actualizar el contexto del payload con los archivos filtrados
            updatePayload({
              uploads: arr
            });
            
            return arr;
          });
          console.warn(error);
        }
      }
    }
    setIsAnyElementLoading(false);
  }

  // Permite al padre renderizar los archivos seleccionados donde quiera
  return (
    <>
      <div className="uploader-container">
        <h2>Sube una o varias fotos del espacio por favor</h2>
        <div className="file-uploader" onClick={() => inputRef?.current?.click()}>
          {text}
          <CgSoftwareUpload />
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={(e) => typeof apiCall === 'function' && handleOnChange(e)}
          />
        </div>
      </div>
      {children && typeof children === 'function' ? children({ selectedFiles, setSelectedFiles }) : null}
    </>
  )
}

export default FileUploader
