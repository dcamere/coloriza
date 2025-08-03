import { useState } from 'react'
import { CustomInput } from '../components/CustomInput/CustomInput'
import { Textarea } from '../components/Textarea/Textarea'
import { PAGE3 } from '../utils/thumbs'
import { useFormContext } from 'react-hook-form'

export const Step3 = ({ register }) => {
  const methods = useFormContext()
  const formData = methods.getValues()
  const previousSelected =
    formData['espacioMural'] && formData['espacioMuralOpcional']
      ? ''
      : formData['espacioMural']

  const [selectedOption, setSelectedOption] = useState(previousSelected)
  const [textInput, setTextInput] = useState(
    formData['espacioMuralOpcional'] || '',
  )

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value)
    methods.setValue('espacioMuralOpcional', '')
    setTextInput('')
  }

  const handleTextareaChange = (event) => {
    setTextInput(event.target.value)
    methods.setValue('espacioMural', '')
    setSelectedOption('')
  }

  return (
    <>
      <h2 className="title">Espacio disponible</h2>
      <div className="input-container">
        {[
          {
            name: 'habitación',
            // description:
            //   'Rostros, fotorealismo y paisajes fieles a la realidad',
            image: 'habitacion',
          },
          {
            name: 'oficinas',
            // description:
            //   'Rostros, fotorealismo y paisajes fieles a la realidad',
            image: 'oficinas',
          },
          {
            name: 'fachadas',
            // description:
            //   'Rostros, fotorealismo y paisajes fieles a la realidad',
            image: 'fachadas',
          },
          {
            name: 'Local comercial',
            // description:
            //   'Rostros, fotorealismo y paisajes fieles a la realidad',
            image: 'local-comercial',
          },
        ].map((item) => (
          <CustomInput
            key={item.name}
            title={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            image={`${item.image}.png`}
            placeholder={PAGE3[item.image]}
            name="espacioMural"
            value={item.name}
            active={selectedOption === item.name}
            onChange={handleRadioChange}
            register={register}
            // description={item?.description}
          />
        ))}

        <Textarea
          textInput={textInput}
          register={register}
          name="espacioMuralOpcional"
          placeholder="Otra opción (Mall, centros comerciales, activaciones y publicidad)"
          maxLength="200"
          cleanOption={handleTextareaChange}
        />
      </div>
    </>
  )
}
