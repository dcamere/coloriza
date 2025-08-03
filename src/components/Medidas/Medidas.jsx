import './Medidas.scss'
import React, { useState, useEffect, useRef } from 'react'
import { Input } from '../Input/Input'
import { useFormContext } from 'react-hook-form'
import { useFormPayload } from '../../contexts/FormContext'

export const Medidas = (props) => {
  const { updatePayload } = useFormPayload()
  const methods = useFormContext()
  const formData = methods.getValues()
  const { formState: { errors }, trigger } = methods;
  const wallRef = useRef(null)

  const { register } = props
  const [width, setWidth] = useState(formData['ancho'] || 0)
  const [height, setHeight] = useState(formData['alto'] || 0)
  const [area, setArea] = useState(0)

  const handleHeightChange = async (e) => {
    const value = Number(e.target.value);
    setHeight(value);
    // Actualizar el valor en react-hook-form
    methods.setValue('alto', value);
    // Disparar validación en tiempo real
    await trigger('alto');
  }

  const handleWidthChange = async (e) => {
    const value = Number(e.target.value);
    setWidth(value);
    // Actualizar el valor en react-hook-form
    methods.setValue('ancho', value);
    // Disparar validación en tiempo real
    await trigger('ancho');
  }

  // Función para manejar el blur y disparar validación
  const handleBlur = async (fieldName) => {
    await trigger(fieldName);
  }

  useEffect(() => {
    if (height > 0 && width > 0) {
      areaCalculation(height, width)
      // Guardar el área calculada en el formulario y en el contexto
      const calculatedArea = width * height
      setArea(calculatedArea)
      methods.setValue('area', calculatedArea)
      
      // Actualizar el contexto del payload con las medidas
      updatePayload({
        ancho: width,
        alto: height,
        area: calculatedArea
      })
    }
  }, [height, width]) // Removido setValue y updatePayload de las dependencias

  const areaCalculation = (height, width) => {
    if (!height || !width || !wallRef.current) return
    const wall = wallRef.current
    if (height === width) {
      wall.style.width = '100%'
      wall.style.height = '100%'
    } else if (width > height) {
      wall.style.width = '100%'
      wall.style.height = `${(height / width) * 100}%`
    } else {
      wall.style.height = '100%'
      wall.style.width = `${(width / height) * 100}%`
    }
    wall.style.backgroundSize = `${100 / width}% ${100 / height}%`
  }

  return (
    <>
      <div className="medidas">
        <div className="medidas__seccion1">
          <div className="top-wrapper">
            <div className="medidas__inputs">
              <div>
                <h2>Metros de ancho | Horizontal</h2>
                <Input
                  inputclass="medidas__seccion1__input"
                  name="ancho"
                  type="number"
                  min="1"
                  placeholder="Escribe la medida en metros"
                  register={register}
                  onChange={handleWidthChange}
                  error={errors.ancho}
                  onBlur={() => handleBlur('ancho')}
                />
              </div>
              <div>
                <h2>Metros de alto | Vertical</h2>
                <Input
                  inputclass="medidas__seccion1__input"
                  name="alto"
                  type="number"
                  min="1"
                  placeholder="Escribe la medida en metros"
                  register={register}
                  onChange={handleHeightChange}
                  error={errors.alto}
                  onBlur={() => handleBlur('alto')}
                />
              </div>
            </div>
            <div className="medidas__seccion1__bottom">
              <h2>
                Área total: <span>{`${area}m²`}</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="medidas__seccion2">
          {height > 0 && width > 0 && (
            <div className="secure-area">
              <div className="height-label">Altura: {height}m</div>
              <div className="width-label">Ancho: {width}m</div>
              <div className="wall squares" id="wall" ref={wallRef}></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
