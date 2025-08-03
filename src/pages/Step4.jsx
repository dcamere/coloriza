import { FileUploader } from '../components/FileUploader/FileUploader'
import { Medidas } from '../components/Medidas/Medidas'
import { ENV_VARS } from '../utils/constants/index'

const fileUploadFunction = async (payload) => {
  if (!payload) return

  const response = await fetch(`${ENV_VARS.URL_PATH}/upload/pictures`, {
    method: 'POST',
    body: payload,
  }).then((response) => {
    if (response.ok) {
      return response.json()
    } else {
      throw new Error('Error in fetch request')
    }
  })

  return response
}

export const Step4 = ({
  setValue,
  register,
  isAnyElementLoading,
  setIsAnyElementLoading,
}) => {
  return (
    <>
      <h2 className="title">Medidas</h2>
      <div className="main-container">
        <Medidas register={register} />
        <div className="uploader-container">
          <h2>Sube una foto para entendernos mejor:</h2>
          <FileUploader
            setValue={setValue}
            apiCall={fileUploadFunction}
            text="Seleccionar archivo"
            isAnyElementLoading={isAnyElementLoading}
            setIsAnyElementLoading={setIsAnyElementLoading}
          />
        </div>
      </div>
    </>
  )
}
