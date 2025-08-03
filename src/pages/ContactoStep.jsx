import React from 'react'
import { Input } from '../components/Input/Input'
import { CustomSelect } from '../components/CustomSelect/CustomSelect'

export const ContactoStep = ({ register }) => {
  return (
    <>
      <h2 className="title">Contacto</h2>
      <div className="form-container">
        <div className='f-group'>
          <div>
            <h2>Nombre de contacto</h2>
            <Input
              placeholder="Nombre o alias incógnito"
              register={register}
              type="text"
              name="nombreContacto"
            />
          </div>
          <div>
            <h2>¿Cómo te enteraste de nosotros?</h2>
            <CustomSelect
              options={["Sitio web", "Youtube", "Instagram", "Facebook", "Amistad o contacto", "Colaboramos anteriormente", "Tarjeta personal", "Evento o actividad"]}
              placeholder="Selecciona una opción"
              register={register}
              name="comoEnteraste"
            />
          </div>
        </div>
        <div className='f-group'>
          <div>
            <h2>Whatsapp <span style={{fontWeight: 'normal'}}>(opcional)</span></h2>
            <Input
              placeholder="999999999"
              register={register}
              type="text"
              name="whatsapp"
              maxLength="9"
            />
          </div>
          <div>
            <h2>Email <span style={{fontWeight: 'normal'}}>(opcional)</span></h2>
            <Input
              placeholder="email@correo.com"
              register={register}
              type="email"
              name="email"
            />
          </div>
        </div>
      </div>
    </>
  )
}
