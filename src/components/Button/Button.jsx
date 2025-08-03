import './Button.scss'

export const Button = (props) => {
  const { type, disabled, onClick, children, className, hidden } = props

  return (
    <button
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
    >
      <span className='button-label'>{children}</span>
    </button>
  )
}
