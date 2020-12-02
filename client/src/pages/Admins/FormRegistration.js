import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {func} from 'prop-types';

import {useTranslation} from 'react-i18next';

import {connect} from 'react-redux';
import {authorization} from '../../actions';
import isPasswordAllowed from '../../utils/isPasswordAllowed';
import Loader from '../../components/Loader';
import ModalError from '../../components/ModalError';

import './FormRegistration.scss';
// import host from '../../host';

const url = `${process.env.REACT_APP_API_URL}/registration`;

const FormRegistration = ({authorization}) => {
  function setDefaultLanguage() {
    let currentLanguage =
      navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2);

    if (currentLanguage !== 'en' && currentLanguage !== 'ru') {
      return 'en';
    }

    return currentLanguage;
  }

  const {t} = useTranslation();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);
  const [badPassword, setBadPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [existEmail, setExistEmail] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [toAdminPage, setToAdminPage] = useState(false);
  const [notEqualPassword, setNotEqualPassword] = useState(false);

  const [showModalError, setShowModalError] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    type: 'Registration form',
    message: undefined,
  });

  function ModalErrorWindow() {
    const handleCloseModal = () => {
      setShowModalError(false);
    };

    return (
      <main>
        <ModalError
          show={showModalError}
          handleClose={handleCloseModal}
          typeOfError={errorInfo}
        ></ModalError>
      </main>
    );
  }

  useEffect(() => {
    if (password !== null && !isPasswordAllowed(password)) {
      setBadPassword(true);
    } else {
      setBadPassword(false);
    }

    if (
      password !== null &&
      confirmPassword !== null &&
      confirmPassword !== password
    ) {
      setNotEqualPassword(true);
    }
    if (password === confirmPassword) {
      setNotEqualPassword(false);
    }
  }, [password, confirmPassword]);

  // original ---> /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email)

  const validateForm = () => {
    function validMail(mail) {
      return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>().,;\s@"]+\.{0,1})+([^<>().,;:\s@"]{2,}|[\d.]+))$/.test(
        mail,
      );
    }

    const isEmail = validMail(email);

    let isInvalid = true;
    if (password !== null) {
      const isPasswordCorrect = isPasswordAllowed(password);
      isInvalid =
        !fullname ||
        !isEmail ||
        !(confirmPassword === password) ||
        !isPasswordCorrect;
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
      body: `fullname=${fullname}&email=${email}&password=${password}&language=${setDefaultLanguage()}`,
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setExistEmail(true);
            setShowLoader(false);
          }
          if (response.status === 401) {
            setShowLoader(false);
            alert('Email and password do not match, please retry');
          }
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.create) {
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('name', fullname);
          sessionStorage.setItem('signedIn', true);
          authorization([
            {
              name: fullname,
              email: email,
              signedIn: true,
            },
          ]);

          setToAdminPage(true);
          return true;
        }
      })
      .catch((error) => {
        setErrorInfo({
          type: 'Registration form',
          message: error,
        });
        setShowLoader(false);
        setShowModalError(true);
      });
  };

  if (toAdminPage) {
    return <Redirect to="/admin" />;
  }

  return (
    <div>
      <div className="registration-form-loader-container">
        <div className="registration-form-loader-container__loader">
          {showLoader ? Loader() : null}
        </div>
      </div>
      <form
        onSubmit={submitForm}
        className="modal-form modal-form--fields registration-form"
      >
        <h1
          aria-label="registration_form_title"
          className="registration-form__title"
        >
          {t('registrationTitle')}
        </h1>
        <p
          aria-label="registration_form_name"
          className="registration-form__item"
        >
          {t('registrationName')}:
          <input
            aria-label="registration_form_input_name"
            type="text"
            className="modal-form__item registration-form__input"
            onChange={(event) => setFullname(event.target.value)}
            required
          />
        </p>
        <p
          aria-label="registration_form_email"
          className="registration-form__item"
        >
          {t('registrationEmail')}:
          <input
            aria-label="registration_form_input_email"
            type="text"
            className="modal-form__item registration-form__input"
            onChange={(event) => {
              setExistEmail(false);
              setEmail(event.target.value);
            }}
            required
          />
        </p>
        <p
          aria-label="registration_form_password"
          className="registration-form__item"
        >
          {t('registrationPassword')}:
          <input
            aria-label="registration_form_input_password"
            type="password"
            className="modal-form__item registration-form__input"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </p>
        <p
          aria-label="registration_form_confirm_password"
          className="registration-form__item"
        >
          {t('registrationConfirmPassword')}:
          <input
            aria-label="registration_form_input_confirm_password"
            type="password"
            className="modal-form__item registration-form__input"
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </p>
        <p className="registration-form__item ">
          <button
            aria-label="registration_form_button"
            type="submit"
            className="button"
            disabled={validateForm()}
          >
            {t('registrationButton')}
          </button>
        </p>
      </form>
      <div className="registration-form-helper">
        {existEmail ? (
          <p aria-label="registration_form_exist_email">
            {t('registrationEmail')} {email} {t('existEmail')}
          </p>
        ) : null}
        {notEqualPassword ? (
          <h1 aria-label="registration_form_not_equal_password">
            {t('notEqualPassword')}
          </h1>
        ) : null}
        {badPassword ? (
          <h1 aria-label="registration_form_weak_password">
            {t('badPassword')}
          </h1>
        ) : null}
      </div>
      <ModalErrorWindow />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authorizationAdmin: state.authorizationObj,
  };
};

FormRegistration.propTypes = {
  authorization: func,
};

export {FormRegistration};

export default connect(mapStateToProps, {authorization})(FormRegistration);
