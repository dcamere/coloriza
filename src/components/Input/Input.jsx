import React from 'react'
import './Input.scss'

export const Input = ({ name, type, min, placeholder, inputclass, register, ...rest }) => {
  return (
    <div className={`input ${inputclass ? inputclass : ''}`}>
      <input
        {...register(name)}
        placeholder={placeholder}
        type={type || 'text'}
        min={min > 0 ? min : undefined}
        {...rest}
      />
    </div>
  )
}
