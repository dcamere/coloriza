// RecaptchaV3.js
import React, { useEffect, useCallback } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export const RecaptchaV3 = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) return
    try {
      return await executeRecaptcha('submitCustomer')
    } catch (error) {
      console.error('No se pudo ejecutar ReCAPTCHA:', error)
    }
  }, [executeRecaptcha])

  RecaptchaV3.executeRecaptcha = handleRecaptcha

  useEffect(() => {
    handleRecaptcha()
  }, [handleRecaptcha])

  return null
}
