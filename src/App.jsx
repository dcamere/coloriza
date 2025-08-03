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
import { Step1, Step2, Step3, Step4, Step5 } from './pages/index'
import validators from './utils/validators/index'
import { UserRegister } from './api/UserRegister'
import { ENV_VARS } from './utils/constants/index'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { RecaptchaV3 } from './components/RecaptchaV3/RecaptchaV3'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepText, setStepText] = useState('Lugar y fecha')
  const schema = Yup.object().shape(validators[currentStep])
  const [isAnyElementLoading, setIsAnyElementLoading] = useState(false)

  const { control, setValue, register, formState, handleSubmit, getValues } =
    useForm({
      resolver: yupResolver(schema),
    })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreloaderOpen, setIsPreloaderOpen] = useState(true)
  document.body.classList[isModalOpen || isPreloaderOpen ? 'add' : 'remove'](
    'no-scroll',
  )

  const onSubmit = async (data) => {
    if (!isLoading) setIsLoading(true)
    const token = await RecaptchaV3.executeRecaptcha()
    if (!token) return

    setValue('grecaptcha', token)

    const response = await UserRegister(data)
    if (response) setIsModalOpen(true)
    setIsLoading(false)
    console.log('Rspt: ', response)
  }

  const mainSteps = [Step1, Step2, Step3, Step4, Step5]
  const ActualStep = mainSteps[currentStep]

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setIsPreloaderOpen(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  const updateStepText = () => {
    if (window.innerWidth <= 768) {
      setStepText('Lugar')
    } else {
      setStepText('Lugar y fecha')
    }
  }

  useEffect(() => {
    updateStepText()

    window.addEventListener('resize', updateStepText)

    return () => {
      window.removeEventListener('resize', updateStepText)
    }
  }, [currentStep])

  return (
    <>
      <Preloader open={isPreloaderOpen} />
      <GoogleReCaptchaProvider reCaptchaKey={ENV_VARS.RECAPTCHA_PUBLIC}>
        <FormProvider methods={{ getValues, setValue }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="form-body"
          >
            <div className="step-container">
              <Steps
                setCurrentStep={setCurrentStep}
                steps={['Estilo', 'Superficie', 'Espacio', 'Medidas', stepText]}
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

export default App
