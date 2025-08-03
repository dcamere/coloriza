import React, { useRef, useState, useEffect } from 'react'
import './FileUploader.scss'
import FileItem from './SingleFile'
import { CgSoftwareUpload } from 'react-icons/cg'
import { useFormContext } from 'react-hook-form'
import { useFormPayload } from '../../contexts/FormContext'


export const FileUploader = (props) => {
  const { updatePayload } = useFormPayload()
  const methods = useFormContext()
  const formData = methods.getValues()
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
  const [hasInteracted, setHasInteracted] = useState(false) // Nuevo estado para trackear interacción
  
  // Obtener errores de validación
  const uploadError = methods.formState?.errors?.uploads?.message

  // Debug effect to monitor form state changes
  useEffect(() => {
    console.log('FileUploader - Form state changed:', {
      isValid: methods.formState.isValid,
      errors: methods.formState.errors,
      uploadError: uploadError,
      selectedFilesCount: selectedFiles.length,
      hasInteracted: hasInteracted
    });
  }, [methods.formState.isValid, uploadError, selectedFiles.length, hasInteracted]);

  // Efecto para sincronizar selectedFiles con el formulario y payload
  useEffect(() => {
    const syncFiles = async () => {
      const filesString = selectedFiles.length > 0 ? JSON.stringify(selectedFiles) : '';
      console.log('Updating uploads field:', { selectedFiles: selectedFiles.length, filesString });
      setValue('uploads', filesString);
      
      // Solo disparar validación si el usuario ya interactuó
      if (hasInteracted) {
        const validationResult = await methods.trigger('uploads');
        console.log('Validation result for uploads:', validationResult);
        console.log('Form errors after validation:', methods.formState.errors);
      }
      
      updatePayload({
        uploads: selectedFiles
      });
    };
    
    syncFiles();
  }, [selectedFiles, hasInteracted]); // Agregar hasInteracted como dependencia

  const handleUploadClick = () => {
    setHasInteracted(true); // Marcar interacción al hacer clic
    inputRef?.current?.click();
  };

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
              return [...arr, response];
            });
          }
        } catch (error) {
          setSelectedFiles((selectedFiles) => {
            return selectedFiles.filter((item) => item.name !== file.name);
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
      <div className="uploader-container" style={{ position: 'relative' }}>
        <h2>Sube una o varias fotos del espacio por favor</h2>
        <div className="file-uploader" onClick={handleUploadClick}>
          {text}
          <CgSoftwareUpload />
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={(e) => typeof apiCall === 'function' && handleOnChange(e)}
          />
        </div>
        {uploadError && hasInteracted && (
          <div className="error-message" style={{ 
            position: 'absolute', 
            bottom: '-2px',
            left: '0',
            color: 'red',
            textAlign: 'center',
            marginTop: '8px',
            right: '0',
            zIndex: 10,
            padding: '4px 8px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '10px'
          }}>
            {uploadError}
          </div>
        )}
      </div>
      {children && typeof children === 'function' ? children({ selectedFiles, setSelectedFiles }) : null}
    </>
  )
}

export default FileUploader
