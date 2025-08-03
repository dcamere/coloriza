import FileItem from '../components/FileUploader/SingleFile'
import { FileUploader } from '../components/FileUploader/FileUploader'
import { Medidas } from '../components/Medidas/Medidas'
import { ENV_VARS } from '../utils/constants/index'
import { useFormContext } from 'react-hook-form'

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
      <div className="medidas-logo">
        <img src="/COLORIZA-TU-BARRIO.svg" alt="Coloriza Logo" />
      </div>
      <div className="main-container">
        <Medidas register={register} />
        {/* Campo oculto para registrar uploads en react-hook-form */}
        <input
          type="hidden"
          {...register('uploads')}
        />
        <FileUploader
          setValue={setValue}
          apiCall={fileUploadFunction}
          text="Subir imágenes"
          isAnyElementLoading={isAnyElementLoading}
          setIsAnyElementLoading={setIsAnyElementLoading}
        >
          {({ selectedFiles, setSelectedFiles }) => <>
            <div className="selected-files">
              <FileItem
                setValue={setValue}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </div>
          </>}
        </FileUploader>
      </div>
    </>
  )
}
