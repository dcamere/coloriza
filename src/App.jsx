import { React } from 'react'
import './App.scss'
import { useState, useEffect, useLayoutEffect } from 'react'

import { Modal } from './components/Modal/Modal'
import { Footer } from './components/Footer/Footer'
import { Preloader } from './components/Preloader/Preloader'
import { Steps } from './components/Steps/Steps'
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
  const { updatePayload, getPayloadForAPI, resetPayload } = useFormPayload()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepText, setStepText] = useState('Medidas')
  // Solo 3 pasos: Medidas (0), Ubicación (1), Contacto (2)
  const schema = Yup.object().shape(validators[currentStep])
  const [isAnyElementLoading, setIsAnyElementLoading] = useState(false)

  const methods = useForm({
    resolver: yupResolver(schema),
  })
  
  const { control, setValue, register, formState, handleSubmit, getValues, watch } = methods

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreloaderOpen, setIsPreloaderOpen] = useState(true)
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

  // Debug effect separado para evitar loops
  useEffect(() => {
    console.log('Form state:', {
      isValid: formState.isValid,
      errors: formState.errors,
      currentStep
    })
  }, [formState.isValid, currentStep])

  const onSubmit = async (data) => {
    if (!isLoading) setIsLoading(true)
    const token = await RecaptchaV3.executeRecaptcha()
    if (!token) return

    // Actualizar el payload final con el token de reCAPTCHA
    updatePayload({ ...data, grecaptcha: token })
    
    // Obtener el payload estructurado para la API
    const finalPayload = getPayloadForAPI()
    
    console.log('Payload final enviado:', finalPayload)
    
    const response = await UserRegister(finalPayload)
    if (response) {
      setIsModalOpen(true)
      resetPayload() // Limpiar el payload después del envío exitoso
    }
    setIsLoading(false)
    console.log('Respuesta del API:', response)
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
      setStepText('Medidas')
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
            <div className="step-container">
              <Steps
                setCurrentStep={setCurrentStep}
                steps={['Medidas', 'Ubicación', 'Contacto']}
                currentStep={currentStep}
              />
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
          <span className="title">¡Envío exitoso!</span>
          <p>
            Tu solicitud ha sido recibida, te contactaremos por correo y
            whatsApp
          </p>
          <a className="button forward" href="https://vertices.pro/">
            Conoce más
          </a>
        </Modal>

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
