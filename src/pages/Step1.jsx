import { useState } from 'react'
import { CustomInput } from '../components/CustomInput/CustomInput'
import { Textarea } from '../components/Textarea/Textarea'
import { PAGE1 } from '../utils/thumbs'
import { useFormContext } from 'react-hook-form'

export const Step1 = ({ register }) => {
  const { getValues, setValue } = useFormContext().methods
  const formData = getValues()
  const previousSelected =
    formData['estiloMural'] && formData['estiloMuralOpcional']
      ? ''
      : formData['estiloMural']

  const [selectedOption, setSelectedOption] = useState(previousSelected)
  const [textInput, setTextInput] = useState(
    formData['estiloMuralOpcional'] || '',
  )

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value)
    setValue('estiloMuralOpcional', '')
    setTextInput('')
  }

  const handleTextareaChange = (event) => {
    setTextInput(event.target.value)
    setValue('estiloMural', '')
    setSelectedOption('')
  }

  return (
    <>
      <h2 className="title">Elige el estilo de tu mural</h2>
      <div className="input-container">
        {[
          {
            title: 'realismo',
            description: 'Rostros y propuestas fotográficas',
          },
          {
            title: 'graffiti',
            description: 'Graffiti, letras y mezcla de estilos',
          },
          {
            title: 'personajes',
            description: 'Caricaturas y personajes creativos',
          },
          {
            title: 'escenarios',
            description: 'Elementos naturales, paisajes y espacios',
          },
        ].map((item) => (
          <CustomInput
            key={item.title}
            title={item.title.charAt(0).toUpperCase() + item.title.slice(1)}
            description={item.description}
            image={`${item.title}.png`}
            placeholder={PAGE1[item.title]}
            name="estiloMural"
            value={item.title}
            active={selectedOption === item.title}
            onChange={handleRadioChange}
            register={register}
          />
        ))}

        <Textarea
          textInput={textInput}
          register={register}
          name="estiloMuralOpcional"
          placeholder="Otra opción (Anime, Dibujos animados, Abstracto etc.)"
          maxLength="200"
          cleanOption={handleTextareaChange}
        />
      </div>
    </>
  )
}
