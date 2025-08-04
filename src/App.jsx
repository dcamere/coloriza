import { React } from 'react'
import './App.scss'
import { useState, useEffect, useLayoutEffect } from 'react'

import { Modal } from './components/Modal/Modal'
import { Footer } from './components/Footer/Footer'
import { Preloader } from './components/Preloader/Preloader'
import { Steps } from './components/Steps/Steps'
import { Toast } from './components/Toast/Toast'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Step4 } from './pages/Step4'
import { UbicacionStep } from './pages/UbicacionStep'
import { ContactoStep } from './pages/ContactoStep'
import validators from './utils/validators/index'
import { UserRegister } from './api/UserRegister'
import { ENV_VARS } from './utils/constants/index'
import { FormPayloadProvider, useFormPayload } from './contexts/FormContext'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { RecaptchaV3 } from './components/RecaptchaV3/RecaptchaV3'

function AppContent() {
  const { updatePayload, getPayloadForAPI, resetPayload, payload } = useFormPayload()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepText, setStepText] = useState('Muro')
  // Solo 3 pasos: Muro (0), Ubicación (1), Contacto (2)
  const schema = Yup.object().shape(validators[currentStep])
  const [isAnyElementLoading, setIsAnyElementLoading] = useState(false)

  const methods = useForm({
    resolver: yupResolver(schema),
  })
  
  const { control, setValue, register, formState, handleSubmit, getValues, watch } = methods

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreloaderOpen, setIsPreloaderOpen] = useState(true)
  const [toastConfig, setToastConfig] = useState({ isOpen: false, message: '', type: 'error' })
  document.body.classList[isModalOpen || isPreloaderOpen ? 'add' : 'remove'](
    'no-scroll',
  )

  // Observar cambios en el formulario y guardarlos en el payload
  const watchedValues = watch()
  
  // Usar useMemo para evitar actualizaciones innecesarias
  const watchedValuesString = JSON.stringify(watchedValues)
  
  useEffect(() => {
    // Actualizar el payload cada vez que cambien los valores del formulario
    if (Object.keys(watchedValues).length > 0) {
      updatePayload(watchedValues)
    }
  }, [watchedValuesString, updatePayload])

  // Función helper para obtener el payload con el token de reCAPTCHA incluido
  const getPayloadForAPIWithToken = (currentPayload, token) => {
    // Procesar los archivos subidos si existen
    let uploadedFiles = []
    if (currentPayload.uploads) {
      try {
        uploadedFiles = typeof currentPayload.uploads === 'string' 
          ? JSON.parse(currentPayload.uploads) 
          : currentPayload.uploads
      } catch (error) {
        console.warn('Error parsing uploads:', error)
        uploadedFiles = []
      }
    }

    // Generar URL de Google Maps si hay coordenadas
    let ubicacionGoogleMaps = ''
    if (currentPayload.latitud && currentPayload.longitud) {
      ubicacionGoogleMaps = `https://www.google.com/maps?q=${currentPayload.latitud},${currentPayload.longitud}`
    }

    // Estructurar el payload final para el API solo con campos utilizados
    const finalPayload = {
      // Medidas (Step 1)
      ancho: currentPayload.ancho || null,
      alto: currentPayload.alto || null,
      area: currentPayload.area || null,
      
      // Ubicación (Step 2) - URL de Google Maps en lugar de coordenadas separadas
      ubicacionGoogleMaps: ubicacionGoogleMaps,
      direccionUsuario: currentPayload.direccionUsuario || '',
      porQueMejorar: currentPayload.porQueMejorar || '',
      
      // Contacto (Step 3)
      nombreContacto: currentPayload.nombreContacto || '',
      comoEnteraste: currentPayload.comoEnteraste || '',
      whatsapp: currentPayload.whatsapp || '',
      email: currentPayload.email || '',
      
      // Archivos subidos
      uploads: uploadedFiles,
      
      // reCAPTCHA - asegurar que el token se incluya
      grecaptcha: token || currentPayload.grecaptcha || '',
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
  }

  const onSubmit = async (data) => {
    if (!isLoading) setIsLoading(true)
    const token = await RecaptchaV3.executeRecaptcha()
    if (!token) {
      setToastConfig({
        isOpen: true,
        message: 'Error con reCAPTCHA. Intente nuevamente.',
        type: 'error'
      })
      setIsLoading(false)
      return
    }

    // Actualizar el payload final con el token de reCAPTCHA
    const dataWithToken = { ...data, grecaptcha: token }
    updatePayload(dataWithToken)
    
    // Obtener el payload estructurado para la API con el token incluido
    // Necesitamos pasar el token directamente para evitar problemas de timing
    const currentPayload = { ...payload, ...dataWithToken }
    const finalPayload = getPayloadForAPIWithToken(currentPayload, token)
    
    try {
      const response = await UserRegister(finalPayload)
      
      // Verificar si la respuesta contiene un _id (éxito)
      if (response && response._id) {
        setIsModalOpen(true)
        resetPayload() // Limpiar el payload después del envío exitoso
      } else {
        // Si no hay _id, mostrar error
        setToastConfig({
          isOpen: true,
          message: 'No se pudo enviar el formulario, intente nuevamente.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error en API:', error)
      setToastConfig({
        isOpen: true,
        message: 'No se pudo enviar el formulario, intente nuevamente.',
        type: 'error'
      })
    }
    setIsLoading(false)
  }

  // Nuevo orden de pasos: Medidas, Ubicación, Contacto
  const mainSteps = [Step4, UbicacionStep, ContactoStep]
  const ActualStep = mainSteps[currentStep]

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setIsPreloaderOpen(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  // El texto del paso cambia según el currentStep
  useEffect(() => {
    if (currentStep === 0) {
      setStepText('Muro')
    } else if (currentStep === 1) {
      setStepText(window.innerWidth <= 768 ? 'Ubicación' : 'Ubicación')
    } else if (currentStep === 2) {
      setStepText('Contacto')
    }
  }, [currentStep])

  return (
    <>
      <Preloader open={isPreloaderOpen} />
      <GoogleReCaptchaProvider reCaptchaKey={ENV_VARS.RECAPTCHA_PUBLIC}>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="form-body"
          >
            <div className="header-wrapper">
              <div className="header-layout">
                <div className="logo-section">
                  <img src="/COLORIZA-TU-BARRIO.svg" alt="Coloriza Tu Barrio" className="header-logo" />
                </div>
                <div className="step-container">
                  <Steps
                    setCurrentStep={setCurrentStep}
                    steps={['Muro', 'Ubicación', 'Contacto']}
                    currentStep={currentStep}
                  />
                </div>
              </div>
            </div>
            <div className="main-body">
              {
                <ActualStep
                  register={register}
                  control={control}
                  setValue={setValue}
                  isAnyElementLoading={isAnyElementLoading}
                  setIsAnyElementLoading={setIsAnyElementLoading}
                />
              }
            </div>
            <Footer
              setIsModalOpen={setIsModalOpen}
              formState={formState}
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              isLoading={isLoading}
              isAnyElementLoading={isAnyElementLoading}
            />
          </form>
        </FormProvider>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            window.location.reload()
          }}
        >
          <span style={{color: '#FF8A00', fontSize: '26px'}} className="title">Datos enviados con éxito</span>
          <p>
            Gracias por querer mejorar tu barrio a través del arte urbano,  te contactaremos por correo y whatsapp.
          </p>
          <img src="/modal-success.png" alt="" />
          <a style={{fontSize: '24px'}} className="button forward" href="/">
            Volver al inicio
          </a>
        </Modal>

        <Toast
          isOpen={toastConfig.isOpen}
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig({ ...toastConfig, isOpen: false })}
        />

        <RecaptchaV3 />
      </GoogleReCaptchaProvider>
    </>
  )
}

function App() {
  return (
    <FormPayloadProvider>
      <AppContent />
    </FormPayloadProvider>
  )
}

export default App
