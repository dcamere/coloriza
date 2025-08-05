
import { useEffect } from 'react';
import './Modal.scss'

export const Modal = (props) => {

  const { isOpen, onClose, shadowType, modalType, contentNoPadding, contentRadius8, lessPadding } = props;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className={`modal ${isOpen ? 'modal--open' : ''} ${modalType === 'wide' ? 'modal--wide' : ''}`}>
        <div className="modal__closer" onClick={onClose}>X</div>
        <div className={`modal__content${contentNoPadding ? ' modal__content--nopadding' : ''}${contentRadius8 ? ' modal__content--radius8 modal__content--ovh' : ''} ${lessPadding ? 'less-padding' : ''}`}>{props.children}</div>
      </div>
      <div
        className={`modal-shadow ${isOpen ? 'modal-shadow--open' : ''} ${shadowType === 'simple' ? 'modal-shadow--simple' : ''}`}
        onClick={onClose}
      ></div>
    </>
  );
}
