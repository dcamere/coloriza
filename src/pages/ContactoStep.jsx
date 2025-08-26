import React from 'react'
import { Input } from '../components/Input/Input'
import { CustomSelect } from '../components/CustomSelect/CustomSelect'
import { PhoneInput } from '../components/PhoneInput/PhoneInput'
import { useFormContext } from 'react-hook-form'

export const ContactoStep = ({ register }) => {
  const methods = useFormContext()
  const { formState: { errors }, trigger } = methods;

  // Función para manejar el blur y disparar validación
  const handleBlur = async (fieldName) => {
    await trigger(fieldName);
  }

  // Función para manejar el cambio y disparar validación en tiempo real
  const handleChange = async (fieldName) => {
    await trigger(fieldName);
  }
  return (
    <>
      <div className="form-container">
        <div className='f-group'>
          <div>
            <h2>Nombre de contacto</h2>
            <Input
              placeholder="Nombre o alias incógnito"
              register={register}
              type="text"
              name="nombreContacto"
              error={errors.nombreContacto}
              onBlur={() => handleBlur('nombreContacto')}
              onChange={() => handleChange('nombreContacto')}
            />
          </div>
          <div>
            <h2>¿Cómo te enteraste de nosotros?</h2>
            <CustomSelect
              options={["Sitio web", "Youtube", "Instagram", "Facebook", "TikTok", "Amistad o contacto", "Colaboramos anteriormente", "Tarjeta personal", "Evento o actividad"]}
              placeholder="Selecciona una opción"
              register={register}
              name="comoEnteraste"
              error={errors.comoEnteraste}
              onBlur={() => handleBlur('comoEnteraste')}
              onChange={() => handleChange('comoEnteraste')}
            />
          </div>
        </div>
        <div className='f-group'>
          <div>
            <h2>Email</h2>
            <Input
              placeholder="email@correo.com"
              register={register}
              type="email"
              name="email"
              error={errors.email}
              onBlur={() => handleBlur('email')}
              onChange={() => handleChange('email')}
            />
          </div>
          <div>
            <h2>Whatsapp <span style={{ fontWeight: 'normal' }}>(opcional)</span></h2>
            <PhoneInput
              name="whatsapp"
              register={register}
              error={errors.whatsapp}
              onBlur={() => handleBlur('whatsapp')}
              onChange={() => handleChange('whatsapp')}
            />
          </div>
        </div>
      </div>
    </>
  )
}
