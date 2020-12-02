import React from 'react';
import {useTranslation} from 'react-i18next';
import {func, bool, any} from 'prop-types';
import AddUser from './AddUser';

const ModalAddUser = ({handleClose, show, children}) => {
  const {t} = useTranslation();
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div aria-label="modal_add_user" className={showHideClassName}>
      <section className="modal-main modal">
        <button
          aria-label="modal_close_button_add_user"
          className="button modal__button--close"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
        {children}
        <AddUser />
      </section>
    </div>
  );
};

ModalAddUser.propTypes = {
  handleClose: func,
  show: bool,
  children: any,
};

export default ModalAddUser;
