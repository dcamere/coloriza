import './Medidas.scss'
import React, { useState, useEffect, useRef } from 'react'
import { Input } from '../Input/Input'
import { useFormContext } from 'react-hook-form'
import { useFormPayload } from '../../contexts/FormContext'

export const Medidas = (props) => {
  const { updatePayload } = useFormPayload()
  const methods = useFormContext()
  const formData = methods.getValues()
  const wallRef = useRef(null)

  const { register } = props
  const [width, setWidth] = useState(formData['ancho'] || 0)
  const [height, setHeight] = useState(formData['alto'] || 0)
  const [area, setArea] = useState(0)

  const handleHeightChange = (e) => {
    setHeight(Number(e.target.value))
  }

  const handleWidthChange = (e) => {
    setWidth(Number(e.target.value))
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
                  onInput={handleWidthChange}
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
                  onInput={handleHeightChange}
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
