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
  showToast,
}) => {
  return (
    <>
      <div className="main-container">
        <FileUploader
          setValue={setValue}
          apiCall={fileUploadFunction}
          text="Sube tus fotos"
          isAnyElementLoading={isAnyElementLoading}
          setIsAnyElementLoading={setIsAnyElementLoading}
          showToast={showToast}
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
        <Medidas register={register} />
        {/* Campo oculto para registrar uploads en react-hook-form */}
        <input
          type="hidden"
          {...register('uploads')}
        />
      </div>
    </>
  )
}
