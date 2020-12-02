import React from 'react';
import {Redirect} from 'react-router-dom';
import {func, bool, any, string} from 'prop-types';
import {useMutation} from 'react-apollo';
import {DELETE_USER} from '../../queries';
import {useTranslation} from 'react-i18next';

import getAdminEmail from '../../utils/getAdminEmail';

import './ModalUserDel.scss';
import Loader from '../../components/Loader';

const ModalUserDel = ({handleClose, show, children, id, name}) => {
  const {t} = useTranslation();

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  const [
    deleteUser,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(DELETE_USER);

  if (mutationLoading) return Loader();

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  return (
    <div aria-label="modal_delete_user" className={showHideClassName}>
      <section className="modal-main modal">
        <button
          aria-label="modal_close_button_delete_user"
          className="button modal__button--close"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
        <div className="modal__ask">
          <p>{t('Do you realy want to delete')}</p>
          <p>
            {t('the user')}{' '}
            <span
              aria-label="modal_text_username_delete_user"
              className="modal__important"
            >
              "{name}"
            </span>
            !?
          </p>
        </div>
        {children}
        <form
          className="modal-form"
          onSubmit={async (e) => {
            e.preventDefault();
            await deleteUser({
              variables: {
                id,
                email: getAdminEmail(),
              },
            });
            handleClose();
          }}
        >
          <div className="modal__buttons">
            <button
              aria-label="modal_button_yes_delete_user"
              className="button modal__button--submit"
              type="submit"
            >
              {' '}
              {t('Yes')}{' '}
            </button>
            <button
              aria-label="modal_button_no_delete_user"
              className="button modal__button--submit"
              type="button"
              onClick={handleClose}
            >
              {' '}
              {t('No')}{' '}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

ModalUserDel.propTypes = {
  handleClose: func,
  show: bool,
  children: any,
  id: string,
  name: string,
};

export default ModalUserDel;
