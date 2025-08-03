import React from 'react'
import './Input.scss'

export const Input = ({ name, type, min, placeholder, inputclass, register, error, onBlur, onChange, onInput, ...rest }) => {
  const registerProps = register(name);
  
  return (
    <div className={`input ${inputclass ? inputclass : ''} ${error ? 'input--error' : ''}`}>
      <input
        {...registerProps}
        placeholder={placeholder}
        type={type || 'text'}
        min={min > 0 ? min : undefined}
        className={error ? 'error' : ''}
        onBlur={(e) => {
          registerProps.onBlur(e); // Llamar al onBlur del register
          if (onBlur) onBlur(e); // Llamar al onBlur personalizado si existe
        }}
        onChange={(e) => {
          registerProps.onChange(e); // Llamar al onChange del register
          if (onChange) onChange(e); // Llamar al onChange personalizado si existe
        }}
        onInput={(e) => {
          // onInput se dispara antes que onChange
          if (onInput) onInput(e); // Llamar al onInput personalizado si existe
        }}
        {...rest}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  )
}
