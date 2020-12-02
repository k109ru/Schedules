import React, {useState} from 'react';
import {connect} from 'react-redux';
import {func, bool, any} from 'prop-types';

import {deletedAdmin, authorization} from '../../actions';
import {useTranslation} from 'react-i18next';
import Loader from '../../components/Loader';

import './ModalDelAdmin.scss';
// import host from '../../host';

const url = `${process.env.REACT_APP_API_URL}/delete`;

const ModalAdminDel = ({
  handleClose,
  show,
  children,
  deletedAdmin,
  authorization,
  // delAdmin,
}) => {
  const {t} = useTranslation();

  const email = sessionStorage.getItem('email');
  const [password, setPassword] = useState(null);

  const [wrongEmail, setWrongEmail] = useState(false);
  const [wrongPasswordOrEmail, setWrongPasswordOrEmail] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  const [showError, setShowError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  const validateForm = () => {
    let isInvalid = true;
    if (password !== null) {
      isInvalid = false;
    }

    return isInvalid;
  };

  const submitForm = (event) => {
    event.preventDefault();
    setShowLoader(true);

    const options = {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `email=${email}&password=${password}`,
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setWrongEmail(true);
            setShowLoader(false);
          }
          if (response.status === 401) {
            setWrongPasswordOrEmail(true);
            setShowLoader(false);
          }
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.setItem('email', null);
          sessionStorage.setItem('name', null);
          sessionStorage.setItem('signedIn', false);

          authorization([
            {
              email: null,
              name: null,
              signedIn: false,
            },
          ]);
          setShowLoader(false);
          window.location = '/';
          return true;
        }
      })
      .catch((error) => {
        setErrorInfo({
          type: 'Admin delete form',
          message: error,
        });
        setShowLoader(false);
        setShowError(true);
      });
  };

  return (
    <div aria-label="modal_delete_admin" className={showHideClassName}>
      <section className="modal-main modal">
        <button
          aria-label="modal_close_button_delete_admin"
          className="button modal__button--close"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
        <div className="modal__ask">
          <p aria-label="modal_message_part_one_delete_admin">
            {t('Do you realy want to delete')}
          </p>
          <p aria-label="modal_message_part_two_delete_admin">
            {t('your account')}{' '}
            <span
              aria-label="modal_email_delete_admin"
              className="modal__important"
            >
              "{email}"
            </span>
            !?
          </p>
          <p aria-label="modal_warning_delete_admin">
            {t('All your data will be destroyed')}
          </p>
        </div>
        {children}
        <form
          className="modal-form modal-form--fields"
          onSubmit={(e) => {
            e.preventDefault();
            deletedAdmin([{email: email}]);
            submitForm(e);
          }}
        >
          <p aria-label="modal_password_text_delete_admin">
            {t('accountPassord')}:
            <input
              aria-label="modal_password_input_delete_admin"
              type="password"
              className="modal-form__item"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </p>
          <div className="modal__buttons">
            <button
              aria-label="modal_button_yes_delete_admin"
              className="button modal__button--submit form__del-password-button"
              type="submit"
              disabled={validateForm()}
            >
              {t('Yes')}
            </button>
            <button
              aria-label="modal_button_no_delete_admin"
              className="button modal__button--submit form__del-password-button"
              type="button"
              onClick={handleClose}
            >
              {t('No')}
            </button>
          </div>
          <div className="del-password-form-helper">
            {wrongEmail ? <h1>Email {email} not found, please retry</h1> : null}
            {wrongPasswordOrEmail ? (
              <h1 aria-label="modal_error_message_delete_admin">
                Email {email} and password do not match, please retry
              </h1>
            ) : null}
            {showError ? (
              <h1>{`${errorInfo.type} - ${errorInfo.message}`}</h1>
            ) : null}
          </div>
          <div className="del-password-form-loader">
            {showLoader ? Loader() : null}
          </div>
        </form>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    // delAdmin: state.adminObj,
    authorizationAdmin: state.authorizationObj,
  };
};

ModalAdminDel.propTypes = {
  handleClose: func,
  show: bool,
  children: any,
  deletedAdmin: func,
  authorization: func,
};

export {ModalAdminDel};

export default connect(mapStateToProps, {deletedAdmin, authorization})(
  ModalAdminDel,
);
