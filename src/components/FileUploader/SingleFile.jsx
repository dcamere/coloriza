import './FileUploader.scss'
import Loader from '../Loader/Loader'
import { BsXLg } from 'react-icons/bs'
import { useFormPayload } from '../../contexts/FormContext'


export const FileItem = (props) => {
  const { updatePayload } = useFormPayload()
  const { selectedFiles, setSelectedFiles, setValue } = props;

  const handleDelete = (name) => {
    setSelectedFiles((selectedFiles) => {
      const arr = selectedFiles.filter((item) => item.name !== name);
      setValue('uploads', JSON.stringify(arr));
      
      // Actualizar el contexto del payload con los archivos filtrados
      updatePayload({
        uploads: arr
      });
      
      return arr;
    });
  };

  return (
    <div className="file-list">
      {selectedFiles.map((file) => (
        <div className="single-file" key={file.name}>
          {!file.loading && <img src="upload-placeholder.png" alt={file.name} />}
          <span>{file.name}</span>
          {file.loading ? (
            <Loader />
          ) : (
            <div
              className="single-file__close"
              onClick={() => handleDelete(file.name)}
            >
              <BsXLg />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileItem;
