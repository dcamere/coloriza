import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../Input/Input.scss'
import './Datepicker.scss'
import { Controller } from 'react-hook-form'

const Datepicker = ({ name, placeholder, register, control, ...rest }) => {

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  return (
    <div className="input">
      <Controller
        control={control}
        name={name}
        render={({field}) => (
          <DatePicker
            minDate={getTomorrow()}
            selected={field.value}
            placeholderText={placeholder}
            onChange={(date) => field.onChange(date)}
          />
      )}
      />
    </div>
  )
}

export default Datepicker
