import { React, useState, useEffect } from 'react'
import './CustomInput.scss';
export const CustomInput = (props) => {
  const {
    title,
    description,
    image,
    placeholder,
    name,
    value,
    onChange,
    register,
    active,
  } = props

  const [imageLoaded, setImageLoaded] = useState(placeholder);
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    const img = new Image()
    img.src = image
    img.onload = () => {
      setImageLoaded(image)
      setloaded(true)
    };
  }, []);

  const handleChange = (event) => {
    if (onChange) onChange(event)
  }

  return (
    <label
      htmlFor={value}
      className={`custom-input ${active ? 'custom-input--checked' : ''}`}
    >
      <img src={imageLoaded} alt={title} className={loaded ? 'loaded' : ''} />
      <h3>{title}</h3>
      <p>{description}</p>
      <input
        type="radio"
        id={value}
        name={name}
        value={value}
        checked={active}
        {...register(name, {
          onChange: (e) => handleChange(e),
        })}
      />
    </label>
  )
}
