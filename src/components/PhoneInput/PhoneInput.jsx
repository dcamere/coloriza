import React, { useState, useRef } from 'react';
import countryData from '../../utils/constants/countryPhoneData'; // Debes crear este archivo con los países, banderas y prefijos
import './PhoneInput.css';
import '../Input/Input.css';

export const PhoneInput = ({ name, register, error, onBlur, onChange }) => {
    // Si se usa react-hook-form, actualiza el valor del campo en el form
    const setFormValue = register && register(name) && register(name).onChange;
    const [selectedCountry, setSelectedCountry] = useState(countryData.find(c => c.code === 'PE') || countryData[0]);
    const [number, setNumber] = useState('');
    const selectRef = useRef(null);

    const handleNumberChange = (e) => {
        setNumber(e.target.value);
        if (onChange) onChange();
    };

    const handleCountryChange = (e) => {
        const country = countryData.find(c => c.code === e.target.value);
        setSelectedCountry(country);
        if (onChange) onChange();
    };

    // Actualiza bandera al navegar con teclado
    const handleCountrySelectInput = (e) => {
        const country = countryData.find(c => c.code === e.target.value);
        if (country) setSelectedCountry(country);
    };

    const fullNumber = `${selectedCountry.prefix}${number}`;

    // Al hacer click en la bandera, enfoca el select
    const handleFlagClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (selectRef.current) {
            selectRef.current.focus();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={`phone-input-container input${error ? ' input--error' : ''}`} style={{ height: '44px', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <select
                            ref={selectRef}
                            className="country-select"
                            value={selectedCountry.code}
                            onChange={handleCountryChange}
                            onInput={handleCountrySelectInput}
                            onKeyUp={handleCountrySelectInput}
                            onBlur={onBlur}
                            style={{ height: '100%', border: 'none', background: 'transparent', padding: '0 4px', boxSizing: 'border-box' }}
                        >
                            {countryData.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.code} ({country.prefix})
                                </option>
                            ))}
                        </select>
                        <img
                            src={`https://flagcdn.com/24x18/${selectedCountry.code.toLowerCase()}.png`}
                            alt={selectedCountry.name}
                            style={{ width: 24, height: 18, borderRadius: 2, objectFit: 'cover', marginLeft: 6, cursor: 'pointer' }}
                            onClick={handleFlagClick}
                        />
                    </div>
                    <input
                        className="number-input"
                        type="tel"
                        placeholder="Número sin prefijo"
                        value={number}
                        maxLength={15}
                        onChange={e => {
                            const onlyDigits = e.target.value.replace(/\D/g, '');
                            setNumber(onlyDigits);
                            if (setFormValue) {
                                setFormValue({
                                    target: {
                                        name,
                                        value: `${selectedCountry.prefix}${onlyDigits}`
                                    }
                                });
                            }
                            if (onChange) onChange();
                        }}
                        onBlur={onBlur}
                        style={{ height: '100%', flex: 1, background: '#f8f9fc', border: 'none', padding: '6px 12px', color: 'black' }}
                        name={name}
                        ref={register ? register(name, { setValueAs: () => fullNumber }).ref : undefined}
                    />
                </div>
            </div>
            {error && <span className="error-message">{error.message}</span>}
        </div>
    );
};
