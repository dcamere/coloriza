import './FileUploader.scss'
import Loader from '../Loader/Loader'
import { BsXLg } from 'react-icons/bs'
import { FaFilePdf } from 'react-icons/fa'
import { useFormPayload } from '../../contexts/FormContext'


export const FileItem = (props) => {
  const { updatePayload } = useFormPayload()
  const { selectedFiles, setSelectedFiles, setValue } = props;

  const handleDelete = (name) => {
    setSelectedFiles((selectedFiles) => {
      return selectedFiles.filter((item) => item.name !== name);
    });
  };

  return (
    <div className="file-list">
      {selectedFiles.map((file) => (
        <div className="single-file" key={file.name}>
          {file.preview && (
            <img src={file.preview} alt={file.name} />
          )}
          {!file.preview && file.type === 'application/pdf' && (
            <FaFilePdf style={{ fontSize: '30px', color: '#d32f2f', width: '20px', height: '30px', marginRight: '8px' }} />
          )}
          {!file.preview && file.type !== 'application/pdf' && (
            <img src="upload-placeholder.png" alt={file.name} />
          )}
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
