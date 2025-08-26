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
    showToast,
  } = props

  const inputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState(prevUploads)
  const [hasInteracted, setHasInteracted] = useState(false) // Nuevo estado para trackear interacción
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // // Obtener errores de validación
  // const uploadError = methods.formState?.errors?.uploads?.message

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
  // setCustomError('');
    const files = Array.from(event.target.files);
    const maxFiles = 2;
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Validar cantidad de archivos
    if (selectedFiles.length + files.length > maxFiles) {
      if (typeof showToast === 'function') {
        showToast(`Solo puedes seleccionar un máximo de ${maxFiles} archivos.`, 'error');
      }
      return;
    }

    // Validar cada archivo
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        if (typeof showToast === 'function') {
          showToast('Formato no permitido. Solo JPG, JPEG, PNG, WebP, HEIC o PDF.', 'error');
        }
        return;
      }
      if (file.size > maxSize) {
        if (typeof showToast === 'function') {
          showToast('El archivo supera el peso máximo de 10MB.', 'error');
        }
        return;
      }
    }

    setIsAnyElementLoading(true);
    // Mostrar previews instantáneamente
    const newFiles = files.map(file => ({
      name: file.name,
      loading: true,
      preview: allowedTypes.includes(file.type) && file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      type: file.type
    }));
    setSelectedFiles((selectedFiles) => [...selectedFiles, ...newFiles]);

    // Subir cada archivo y reemplazar el objeto al terminar
    for (const file of files) {
      if (typeof apiCall === 'function') {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await apiCall(formData);
          if (response) {
            setSelectedFiles((selectedFiles) => {
              return selectedFiles.map(item =>
                item.name === response.name
                  ? { ...response, preview: item.preview, loading: false, type: item.type }
                  : item
              );
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

  const handleTooltip = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
  }

  const handleCloseTooltip = (e) => {
    e.stopPropagation();
    setShowTooltip(false);
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleOnChange({ target: { files: e.dataTransfer.files } });
    }
  };

  // Permite al padre renderizar los archivos seleccionados donde quiera
  return (
    <>
      <div
        className="uploader-container"
        style={{ position: 'relative' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, background: 'rgba(255,255,255,0.85)', zIndex: 100, pointerEvents: 'none', border: '3px dotted #d32f2f', boxSizing: 'border-box', borderRadius: '8px' }}>
            <CgSoftwareUpload style={{ fontSize: '48px', color: '#d32f2f', marginBottom: '12px' }} />
            <span style={{ fontSize: '18px', color: '#222' }}>Arrastra tus archivos aquí</span>
          </div>
        )}
        <h2>¿Tienes o conoces una pared donde podamos crear un mural increíble? <br /> Sube una o hasta dos fotos del espacio (pared/muro) para comenzar.</h2>
        <div className="file-uploader" onClick={handleUploadClick}>
          {text}
          <CgSoftwareUpload />
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
            onChange={(e) => typeof apiCall === 'function' && handleOnChange(e)}
          />
          <div className="file-uploader__tooltip" onClick={handleTooltip} title="Reglas de archivos a subir">i</div>
          {showTooltip && (
            <div className="file-uploader__custom-tooltip">
              <span className="file-uploader__custom-tooltip-close" onClick={handleCloseTooltip}>×</span>
              <div className="file-uploader__custom-tooltip-text">
                <div>📌 Se pueden subir máximo 2 archivos.</div>
                <div>📌 Formatos permitidos: JPG, JPEG, PNG, WebP, HEIC, PDF.</div>
                <div>📌 Peso máximo por archivo: 10 MB.</div>
                <div>📌 No hay peso mínimo.</div>
                <div>📌 No es necesaria transformación ni resolución mínima (solo fotos de fachadas).</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {children && typeof children === 'function' ? children({ selectedFiles, setSelectedFiles }) : null}
    </>
  )
}

export default FileUploader
