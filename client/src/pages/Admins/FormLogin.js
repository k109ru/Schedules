import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {func} from 'prop-types';

import {useTranslation} from 'react-i18next';

import {connect} from 'react-redux';
import {authorization} from '../../actions';
import Loader from '../../components/Loader';
import ModalError from '../../components/ModalError';

import './FormLogin.scss';
// import host from '../../host';

const FormLogin = ({authorization}) => {
  const url = `${process.env.REACT_APP_API_URL}/login`;

  const {t} = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);

  const [toAdminPage, setToAdminPage] = useState(false);
  const [wrongEmail, setWrongEmail] = useState(false);
  const [wrongPasswordOrEmail, setWrongPasswordOrEmail] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    type: 'Login form',
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

  const validateForm = () => {
    function validMail(mail) {
      return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>().,;\s@"]+\.{0,1})+([^<>().,;:\s@"]{2,}|[\d.]+))$/.test(
        mail,
      );
    }

    const isEmail = validMail(email);
    let isInvalid = true;
    if (password !== null) {
      isInvalid = !isEmail;
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
          setShowLoader(false);
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('name', data.name);
          sessionStorage.setItem('signedIn', true);
          authorization([
            {
              name: data.name,
              email: email,
              signedIn: true,
            },
          ]);

          return data;
        }
        return data;
      })
      .then((data) => {
        if (data.success) {
          setToAdminPage(true);
        }
      })
      .catch((error) => {
        setErrorInfo({
          type: 'Login form',
          message: error,
        });
        setShowLoader(false);
        setShowModalError(true);
      });
  };

  if (toAdminPage) {
    return <Redirect to="/admin" />;
  }

  // if (errorFromLogin) {
  //   //show modal error window with error message
  // }

  return (
    <div>
      <div className="login-form-loader-container">
        <div className="login-form-loader-container__loader">
          {showLoader ? Loader() : null}
        </div>
      </div>
      <form
        aria-label="login_form_main"
        onSubmit={submitForm}
        className="modal-form modal-form--fields login-form"
      >
        <h1 aria-label="login_form_title" className="login-form__title">
          {t('Login')}
        </h1>
        <p aria-label="login_form_email" className="login-form__item">
          {t('Email')}:
          <input
            aria-label="login_form_input_email"
            type="text"
            className="modal-form__item login-form__input"
            onChange={(event) => {
              setWrongEmail(false);
              setWrongPasswordOrEmail(false);
              setEmail(event.target.value);
            }}
            required
          />
        </p>
        <p aria-label="login_form_password" className="login-form__item">
          {t('Password')}:
          <input
            aria-label="login_form_input_password"
            type="password"
            className="modal-form__item login-form__input"
            onChange={(event) => {
              setWrongEmail(false);
              setWrongPasswordOrEmail(false);
              setPassword(event.target.value);
            }}
            required
          />
        </p>
        <p className="login-form__item">
          <button
            data-testid="login_button"
            aria-label="login_form_button"
            type="submit"
            className="login-form__button button"
            disabled={validateForm()}
          >
            {t('LoginButton')}
          </button>
        </p>
      </form>
      <div className="login-form-helper">
        {wrongEmail ? (
          <h1 aria-label="wrong_email">
            {t('Email')} {email} {t('wrongEmail')}
          </h1>
        ) : null}
        {wrongPasswordOrEmail ? (
          <h1 aria-label="wrong_password">
            {t('Email')} {email} {t('wrongPassword')}
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

FormLogin.propTypes = {
  // authorization: arrayOf(object),
  authorization: func,
};

export {FormLogin};

export default connect(mapStateToProps, {authorization})(FormLogin);
