import './Modal.scss'

export const Modal = (props) => {
  const { isOpen, onClose } = props

  return (
    <>
      <div className={`modal ${isOpen ? 'modal--open' : ''}`}>
        {/* <div className="modal__closer" onClick={onClose}>X</div> */}
        <div className="modal__content">{props.children}</div>
      </div>
      <div
        className={`modal-shadow ${isOpen ? 'modal-shadow--open' : ''}`}
        onClick={onClose}
      ></div>
    </>
  )
}
