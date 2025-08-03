import './Textarea.scss'

export const Textarea = (props) => {
  const { name, register, placeholder, cleanOption, textInput, error, onBlur, ...rest } = props
  const registerProps = register(name);

  return (
  <div className="textarea-wrapper">
      <textarea
        name={name}
        value={textInput}
        className={`textarea ${textInput ? 'textarea--active' : ''} ${error ? 'error' : ''}`}
        placeholder={placeholder}
        {...registerProps}
        onInput={cleanOption}
        onBlur={(e) => {
          registerProps.onBlur(e); // Llamar al onBlur del register
          if (onBlur) onBlur(e); // Llamar al onBlur personalizado si existe
        }}
        {...rest}
      />
      <div className="counter">{textInput.length}/200</div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  )
}
