import { useState } from 'react'
import { CustomInput } from '../components/CustomInput/CustomInput'
import { Textarea } from '../components/Textarea/Textarea'
import { PAGE2 } from '../utils/thumbs'
import { useFormContext } from 'react-hook-form'

export const Step2 = ({ register }) => {
  const methods = useFormContext()
  const formData = methods.getValues()
  const previousSelected =
    formData['superficieMural'] && formData['superficieMuralOpcional']
      ? ''
      : formData['superficieMural']

  const [selectedOption, setSelectedOption] = useState(previousSelected)
  const [textInput, setTextInput] = useState(
    formData['superficieMuralOpcional'] || '',
  )

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value)
    methods.setValue('superficieMuralOpcional', '')
    setTextInput('')
  }

  const handleTextareaChange = (event) => {
    setTextInput(event.target.value)
    methods.setValue('superficieMural', '')
    setSelectedOption('')
  }

  return (
    <>
      <h2 className="title">Tipo de superficie</h2>
      <div className="input-container">
        <CustomInput
          key={'escarchado'}
          title={'escarchado'.charAt(0).toUpperCase() + 'escarchado'.slice(1)}
          image="escarchado.png"
          placeholder={PAGE2['escarchado']}
          name="superficieMural"
          value={'escarchado'}
          active={selectedOption === 'escarchado'}
          onChange={handleRadioChange}
          register={register}
        />
        <CustomInput
          key={'ladrillo'}
          title={'ladrillo'.charAt(0).toUpperCase() + 'ladrillo'.slice(1)}
          image="ladrillo.png"
          placeholder={PAGE2['ladrillo']}
          name="superficieMural"
          value={'ladrillo'}
          active={selectedOption === 'ladrillo'}
          onChange={handleRadioChange}
          register={register}
        />
        <CustomInput
          key={'metal'}
          title={'metal'.charAt(0).toUpperCase() + 'metal'.slice(1)}
          image="metal.png"
          placeholder={PAGE2['metal']}
          name="superficieMural"
          value={'metal'}
          active={selectedOption === 'metal'}
          onChange={handleRadioChange}
          register={register}
        />
        <CustomInput
          key={'lizo pulido'}
          title={'lizo pulido'.charAt(0).toUpperCase() + 'lizo pulido'.slice(1)}
          image="lizopulido.png"
          placeholder={PAGE2['lizo pulido']}
          name="superficieMural"
          value={'lizo pulido'}
          active={selectedOption === 'lizo pulido'}
          onChange={handleRadioChange}
          register={register}
        />

        <Textarea
          textInput={textInput}
          register={register}
          name="superficieMuralOpcional"
          placeholder="Otra opción (Triplay, MDF, Vidrios, etc.)"
          maxLength="200"
          cleanOption={handleTextareaChange}
        />
      </div>
    </>
  )
}
