import './Steps.scss'

export const Steps = (props) => {
  const { steps, currentStep, setCurrentStep } = props
  const progressValue = (100 / (steps.length - 1)) * currentStep;

  return (
    <div
      className="steps"
      style={{
        '--progress-value': `${progressValue}%`,
      }}
    >
      {steps.map((step, index) => {
        return (
          <div
            className={`steps__step ${
              index <= currentStep ? 'is-complete' : ''
            }`}
            // onClick={()=> setCurrentStep(index)}
            key={index}
          >
            <span>{step}</span>
          </div>
        )
      })}
    </div>
  )
}
