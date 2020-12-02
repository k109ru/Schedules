import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {string, func, bool} from 'prop-types';

import Loader from '../../components/Loader';

import './ModalUpdatePassword.scss';
// import host from '../../host';

const url = `${process.env.REACT_APP_API_URL}/update-password`;

const ModalUpdatePassword = ({handleClose, show, email}) => {
  const {t} = useTranslation();

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const [wrongEmail, setWrongEmail] = useState(false);
  const [wrongPasswordOrEmail, setWrongPasswordOrEmail] = useState(false);

  const [notEqualPassword, setNotEqualPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    if (
      password !== null &&
      confirmPassword !== null &&
      confirmPassword !== newPassword
    ) {
      setNotEqualPassword(true);
    }
    if (newPassword === confirmPassword) {
      setNotEqualPassword(false);
    }

    setWrongEmail(false);
    setWrongPasswordOrEmail(false);
  }, [confirmPassword, password, newPassword]);

  const validateForm = () => {
    let isInvalid = true;
    if (password !== null) {
      isInvalid = !(confirmPassword === newPassword);
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
      body: `email=${email}&password=${password}&newpassword=${newPassword}`,
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
          setShowLoader(false);
          handleClose();
        }
      })
      .catch((error) => {
        setErrorInfo({
          type: 'Admin update password form',
          message: error,
        });
        setShowLoader(false);
        setShowError(true);
      });
  };

  return (
    <div aria-label="modal_update_admin_password" className={showHideClassName}>
      <form className="modal-main modal" onSubmit={submitForm}>
        <button
          aria-label="modal_close_button_update_admin_password"
          className="button modal__button--close"
          type="button"
          onClick={handleClose}
        >
          {t('Close')}
        </button>
        <p
          aria-label="modal_password_update_admin"
          className="modal-form--fields"
        >
          {t('accountPassord')}:
          <input
            aria-label="modal_input_password_update_admin"
            type="password"
            className="modal-form__item form__update-password-input"
            onChange={(event) => setPassword(event.target.value)}
          />
        </p>
        <p
          aria-label="modal_new_password_update_admin"
          className="modal-form--fields"
        >
          {t('accountNewPassword')}:
          <input
            aria-label="modal_input_new_password_update_admin"
            type="password"
            className="modal-form__item form__update-password-input"
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </p>
        <p
          aria-label="modal_confirm_password_update_admin"
          className="modal-form--fields"
        >
          {t('accountConfirmPassword')}:
          <input
            aria-label="modal_input_confirm_password_update_admin"
            type="password"
            className="modal-form__item form__update-password-input"
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </p>
        <button
          aria-label="modal_button_update_admin"
          type="submit"
          className="button form__update-password-button"
          disabled={validateForm()}
        >
          {t('Update password')}
        </button>
        <div className="update-password-form-helper">
          {wrongEmail ? <h1>Email {email} not found, please retry</h1> : null}
          {wrongPasswordOrEmail ? (
            <h1 aria-label="modal_message_wrong_email_update_admin">
              Email {email} {t('wrongPassword')}
            </h1>
          ) : null}
          {notEqualPassword ? (
            <h1 aria-label="modal_message_wrong_confirm_password_update_admin">
              {t('notEqualPassword')}
            </h1>
          ) : null}
          {showError ? (
            <h1>{`${errorInfo.type} - ${errorInfo.message}`}</h1>
          ) : null}
        </div>
        <div className="update-password-form-loader">
          {showLoader ? Loader() : null}
        </div>
      </form>
    </div>
  );
};

ModalUpdatePassword.propTypes = {
  handleClose: func,
  show: bool,
  email: string,
};

export default ModalUpdatePassword;
