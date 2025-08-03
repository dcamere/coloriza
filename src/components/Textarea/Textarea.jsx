import './Textarea.scss'

export const Textarea = (props) => {
  const { name, register, placeholder, cleanOption, textInput, ...rest } = props

  return (
  <div className="textarea-wrapper">
      <textarea
        name={name}
        value={textInput}
        className={`textarea ${textInput ? 'textarea--active' : ''}`}
        placeholder={placeholder}
        {...register(name)}
        {...rest}
        onInput={cleanOption}
      />
      <div className="counter">{textInput.length}/200</div>
    </div>
  )
}
