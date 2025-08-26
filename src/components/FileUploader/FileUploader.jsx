import React, { useRef, useState, useEffect } from 'react'
import './FileUploader.scss'
import FileItem from './SingleFile'
import { CgSoftwareUpload } from 'react-icons/cg'
import { CiCamera } from "react-icons/ci";
import { useFormContext } from 'react-hook-form'
import { useFormPayload } from '../../contexts/FormContext'


export const FileUploader = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
  const [showGlobalDrag, setShowGlobalDrag] = useState(false);

  // // Obtener errores de validación
  // const uploadError = methods.formState?.errors?.uploads?.message

  // Efecto para sincronizar selectedFiles con el formulario y payload
  useEffect(() => {
    const syncFiles = async () => {
      const filesString = selectedFiles.length > 0 ? JSON.stringify(selectedFiles) : '';
      setValue('uploads', filesString);
      // Solo disparar validación si el usuario ya interactuó
      if (hasInteracted) {
        await methods.trigger('uploads');
      }
      updatePayload({
        uploads: selectedFiles
      });
    };
    syncFiles();
  }, [selectedFiles, hasInteracted]);

  const handleUploadClick = () => {
    setHasInteracted(true); // Marcar interacción al hacer clic
    inputRef?.current?.click();
  };
  // Global drag events
  useEffect(() => {
    let dragCounter = 0;
    const handleDragEnter = (e) => {
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        dragCounter++;
        setShowGlobalDrag(true);
      }
    };
    const handleDragLeave = (e) => {
      dragCounter--;
      if (dragCounter <= 0) {
        setShowGlobalDrag(false);
        dragCounter = 0;
      }
    };
    const handleDropGlobal = (e) => {
      setShowGlobalDrag(false);
      dragCounter = 0;
    };
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDropGlobal);
    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDropGlobal);
    };
  }, []);

  const handleOnChange = async (event) => {
    // setCustomError('');
    const files = Array.from(event.target.files);
    const maxFiles = 2;
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/svg+xml', 'application/pdf'
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
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
                item.name === response.name && item.loading
                  ? { ...response, id: item.id, preview: item.preview, loading: false, type: item.type }
                  : item
              );
            });
          }
        } catch (error) {
          setSelectedFiles((selectedFiles) => {
            return selectedFiles.filter((item) => item.id !== newFiles.find(f => f.name === file.name)?.id);
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
    setShowGlobalDrag(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleOnChange({ target: { files: e.dataTransfer.files } });
    }
  };

  // Permite al padre renderizar los archivos seleccionados donde quiera
  return (
    <>
      <div
        className={`uploader-container${showGlobalDrag ? ' uploader-container--dragging' : ''}`}
        style={{ position: 'relative' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, boxSizing: 'border-box', borderRadius: '8px' }}>
          <div className="desktop">
            <CgSoftwareUpload fontSize="36px" />
            <span style={{ fontSize: '20px' }} className="desktop__title">Arrastra y suelta las imágenes aquí</span>
            <span style={{ fontSize: '14px' }}>o también</span>
          </div>
          <div className="mobile">
            <p>¿Tienes o conoces una pared donde podamos crear un mural increíble? <br /> <span>Sube una o hasta dos fotos del espacio (pared/muro) para comenzar.</span></p>
          </div>
          <div className="file-uploader">
            {isMobile ? 'Haz tus fotos' : text}
            <CiCamera />
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
      </div>
      {children && typeof children === 'function' ? children({ selectedFiles, setSelectedFiles }) : null}
    </>
  )
}

export default FileUploader
