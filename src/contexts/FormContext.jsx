import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const FormPayloadContext = createContext()

export const useFormPayload = () => {
  const context = useContext(FormPayloadContext)
  if (!context) {
    throw new Error('useFormPayload debe ser usado dentro de FormPayloadProvider')
  }
  return context
}

export const FormPayloadProvider = ({ children }) => {
  const [payload, setPayload] = useState(() => {
    // Intentar recuperar datos guardados del localStorage
    try {
      const savedPayload = localStorage.getItem('coloriza-form-payload')
      return savedPayload ? JSON.parse(savedPayload) : {}
    } catch (error) {
      console.warn('Error recuperando payload del localStorage:', error)
      return {}
    }
  })

  // Guardar en localStorage cada vez que cambie el payload
  useEffect(() => {
    try {
      localStorage.setItem('coloriza-form-payload', JSON.stringify(payload))
    } catch (error) {
      console.warn('Error guardando payload en localStorage:', error)
    }
  }, [payload])

  const updatePayload = useCallback((newData) => {
    setPayload(prevPayload => {
      // Solo actualizar si hay cambios reales
      const hasChanges = Object.keys(newData).some(key => {
        const oldValue = prevPayload[key]
        const newValue = newData[key]
        
        // Comparación más robusta
        if (typeof oldValue === 'object' && typeof newValue === 'object') {
          return JSON.stringify(oldValue) !== JSON.stringify(newValue)
        }
        return oldValue !== newValue
      })
      
      if (!hasChanges) return prevPayload
      
      return {
        ...prevPayload,
        ...newData
      }
    })
  }, [])

  const resetPayload = useCallback(() => {
    setPayload({})
    localStorage.removeItem('coloriza-form-payload')
  }, [])

  const getPayloadForAPI = useCallback(() => {
    // Procesar los archivos subidos si existen
    let uploadedFiles = []
    if (payload.uploads) {
      try {
        uploadedFiles = typeof payload.uploads === 'string' 
          ? JSON.parse(payload.uploads) 
          : payload.uploads
      } catch (error) {
        console.warn('Error parsing uploads:', error)
        uploadedFiles = []
      }
    }

    // Generar URL de Google Maps si hay coordenadas
    let ubicacionGoogleMaps = ''
    if (payload.latitud && payload.longitud) {
      ubicacionGoogleMaps = `https://www.google.com/maps?q=${payload.latitud},${payload.longitud}`
    }

    // Estructurar el payload final para el API solo con campos utilizados
    const finalPayload = {
      // Medidas (Step 1)
      ancho: payload.ancho || null,
      alto: payload.alto || null,
      area: payload.area || null,
      
      // Ubicación (Step 2) - URL de Google Maps en lugar de coordenadas separadas
      ubicacionGoogleMaps: ubicacionGoogleMaps,
      direccionUsuario: payload.direccionUsuario || '',
      porQueMejorar: payload.porQueMejorar || '',
      
      // Contacto (Step 3)
      nombreContacto: payload.nombreContacto || '',
      comoEnteraste: payload.comoEnteraste || '',
      whatsapp: payload.whatsapp || '',
      email: payload.email || '',
      
      // Archivos subidos
      uploads: uploadedFiles,
      
      // reCAPTCHA
      grecaptcha: payload.grecaptcha || '',
    }

    // Solo incluir campos que tienen valores
    const cleanPayload = {}
    Object.keys(finalPayload).forEach(key => {
      const value = finalPayload[key]
      if (value !== null && value !== '' && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          cleanPayload[key] = value
        } else if (!Array.isArray(value)) {
          cleanPayload[key] = value
        }
      }
    })

    return cleanPayload
  }, [payload])

  return (
    <FormPayloadContext.Provider value={{
      payload,
      updatePayload,
      resetPayload,
      getPayloadForAPI
    }}>
      {children}
    </FormPayloadContext.Provider>
  )
}
