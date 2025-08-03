import React from 'react'
import './Footer.scss'
import { Button } from '../Button/Button'
import { FaArrowLeft } from 'react-icons/fa6'
import { FaArrowRight } from 'react-icons/fa6'
import { IconContext } from 'react-icons'

export const Footer = (props) => {
  const {
    formState,
    setCurrentStep,
    currentStep,
    isAnyElementLoading,
    ...rest
  } = props

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="button-container">
          {currentStep !== 0 ? (
            <Button
              type="button"
              className={`button back ${currentStep === 0 ? 'hidden' : ''}`}
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1)
                }
              }}
            >
              <IconContext.Provider value={{ className: 'FaArrowLeft' }}>
                <FaArrowLeft />
              </IconContext.Provider>
              Volver
            </Button>
          ) : (
            <img className="footer-logo" src="LOGO-GRIS.svg" />
          )}

          <Button
            type={currentStep < 2 ? 'button' : 'submit'}
            className={`button forward ${rest.isLoading ? 'is-loading' : ''}`}
            disabled={!formState.isValid || isAnyElementLoading === true}
            onClick={() => {
              if (currentStep < 2) {
                setCurrentStep(currentStep + 1)
              }
            }}
          >
            {currentStep < 2 ? 'Continuar' : 'Finalizar'}
            <IconContext.Provider value={{ className: 'FaArrowRight' }}>
              <FaArrowRight />
            </IconContext.Provider>
          </Button>
        </div>
      </div>
    </footer>
  )
}
