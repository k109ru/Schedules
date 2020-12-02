import React from 'react';
import {object, func, bool} from 'prop-types';
import {useTranslation} from 'react-i18next';

import './ModalError.scss';

function ModalError({handleClose, show, typeOfError}) {
  const {t} = useTranslation();
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main modal modal-error">
        <button
          className="button modal__button--close"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
        <h2 className="modal-error__title">{typeOfError.type}</h2>
        <p
          aria-label="modal_error_window_message"
          className="modal-error__message"
        >
          {`${typeOfError.message}`}
        </p>
      </section>
    </div>
  );
}

ModalError.propTypes = {
  typeOfError: object,
  handleClose: func,
  show: bool,
};

export default ModalError;
