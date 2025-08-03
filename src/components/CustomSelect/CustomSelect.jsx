import React, { useRef, useState } from 'react';
import './CustomSelect.css';

import arrowDown from './arrow-down.svg';
import arrowUp from './arrow-up.svg';

export const CustomSelect = ({ options, placeholder, register, name, error, onBlur, onChange, ...props }) => {
  const selectRef = useRef(null);
  const [open, setOpen] = useState(false);
  const registerProps = register(name);

  // Detect open/close by focus/blur
  const handleFocus = () => setOpen(true);
  const handleBlur = (e) => {
    setOpen(false);
    registerProps.onBlur(e); // Llamar al onBlur del register
    if (onBlur) onBlur(e); // Llamar al onBlur personalizado si existe
  };

  const handleChange = (e) => {
    registerProps.onChange(e); // Llamar al onChange del register
    if (onChange) onChange(e); // Llamar al onChange personalizado si existe
  };

  return (
    <div className={`custom-select-wrapper ${error ? 'custom-select-wrapper--error' : ''}`} style={{ position: 'relative', width: '100%' }}>
      <select
        ref={selectRef}
        {...registerProps}
        defaultValue=""
        className={`input custom-select ${error ? 'error' : ''}`}
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      <img
        src={arrowDown}
        alt={open ? 'Arrow up' : 'Arrow down'}
        className="custom-select-arrow"
        style={{ transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)' }}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};
