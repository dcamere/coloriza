import React, { useRef, useState } from 'react';
import './CustomSelect.css';

import arrowDown from './arrow-down.svg';
import arrowUp from './arrow-up.svg';

export const CustomSelect = ({ options, placeholder, register, name, ...props }) => {
  const selectRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Detect open/close by focus/blur
  const handleFocus = () => setOpen(true);
  const handleBlur = () => setOpen(false);

  return (
    <div className="custom-select-wrapper" style={{ position: 'relative', width: '100%' }}>
      <select
        ref={selectRef}
        {...register(name)}
        defaultValue=""
        className="input custom-select"
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
    </div>
  );
};
