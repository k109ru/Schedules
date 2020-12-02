import React from 'react';
import {func, bool, any, array} from 'prop-types';
import UpdateUser from './UpdateUser';
import {useTranslation} from 'react-i18next';

import './ModalUser.scss';

const ModalUser = ({handleClose, show, children, data}) => {
  //If does not check data ---> component <UpdateUser></UpdateUser> works incorrectly
  const {t} = useTranslation();
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div aria-label="modal_update_user" className={showHideClassName}>
      <section className="modal-main modal">
        <button
          aria-label="modal_close_button_update_user"
          className="button modal__button--close modal__button--close-hide"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
        {children}

        {data[0] ? (
          <UpdateUser user={data[0]} handleClose={handleClose} />
        ) : null}
      </section>
    </div>
  );
};

ModalUser.propTypes = {
  handleClose: func,
  show: bool,
  children: any,
  data: array,
};

export default ModalUser;
