import React from 'react'
import Datepicker from '../components/Datepicker/Datepicker'
import { Input } from '../components/Input/Input'

export const Step5 = ({ register, control }) => {

  // const handleOnBlur = (event) => {
  //   // if (event.target.value) {
  //   //   event.target.className = 'isWritten'
  //   // }
  // }
  return (
    <>
      <h2 className="title">Lugar y fecha</h2>
      <div className="form-container">
        <div className='f-group'>
          <div>
            <h2>Nombre y apellido</h2>
            <Input
              placeholder="Escribe tu nombre"
              register={register}
              type="text"
              name="nombreUsuario"
              // onBlur={handleOnBlur}
            />
          </div>
          <div>
            <h2>¿Para que día necesitas el mural pintado?</h2>
            <Datepicker
              name="fechaRequerida"
              placeholder="Día - Mes - Año"
              register={register}
              control={control}
              dateFormat="dd/MM/yyyy"
              // onBlur={handleOnBlur}
            />
          </div>
        </div>

        <div className='f-group'>
          <div>
            <h2>Ubicación (Dirección)</h2>
            <Input
              placeholder="Escribe la dirección"
              register={register}
              type="text"
              name="direccionUsuario"
              // onBlur={handleOnBlur}
            />
          </div>
          <div>
            <h2>Referencia (Opcional)</h2>
            <Input
              placeholder="Escribe la referencia"
              register={register}
              type="text"
              name="referenciaUsuario"
              // onBlur={handleOnBlur}
            />
          </div>
        </div>

        <div className='f-group'>
          <div>
          <h2>Celular/Whatsapp</h2>
          <Input
            placeholder="999999999"
            register={register}
            type="text"
            name="celularUsuario"
            // onBlur={handleOnBlur}
          />

          </div>
          <div>
            <h2>Email</h2>
            <Input
              placeholder="email@correo.com"
              register={register}
              type="email"
              name="emailUsuario"
              // onBlur={handleOnBlur}
            />
          </div>
        </div>
        <div className='f-group'>
          <div className='w-100 input textarea'>
            <h2>Descripción del mural</h2>
            <textarea
              placeholder="Quiero un mural con animales y plantas para mi restaurante..."
              // register={register}
              {...register('descripcion')}
              name="descripcion"
              // onBlur={handleOnBlur}
            />
          </div>
        </div>

        <p className='obs mart-12'>Este sitio esta protegido por reCAPTCHA. Aplican la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad </a>de Google y los <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Términos del Servicio</a></p>
      </div>
    </>
  )
}
