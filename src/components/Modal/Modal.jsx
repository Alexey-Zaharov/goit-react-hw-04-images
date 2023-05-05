import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ img, showModal }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      showModal();
    }
  };

  return createPortal(
    <div
      className={css.Overlay}
      onClick={event => {
        if (event.target === event.currentTarget) {
          showModal();
        }
      }}
    >
      <div className={css.Modal}>
        <img src={img.webformatURL} alt={img.tags} />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  showModal: PropTypes.func.isRequired,
  img: PropTypes.objectOf(PropTypes.string),
};

export default Modal;
