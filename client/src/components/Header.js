import React, {Fragment, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {func} from 'prop-types';

import {connect} from 'react-redux';
import {authorization} from '../actions/';
import './Header.scss';
import '../App.scss';
import logo from '../images/calendar.svg';

import {useTranslation} from 'react-i18next';

import ModalError from './ModalError';

const url = `${process.env.REACT_APP_API_URL}/logout`;

function Header({authorization}) {
  const {t, i18n} = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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

  if (sessionStorage.getItem('signedIn') === null) {
    sessionStorage.setItem('email', null);
    sessionStorage.setItem('name', null);
    sessionStorage.setItem('signedIn', false);
  }

  Boolean.parse = function (str) {
    switch (str.toLowerCase()) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        throw new Error('Boolean.parse: Cannot convert string to boolean.');
    }
  };

  let signedIn = Boolean.parse(sessionStorage.getItem('signedIn'));

  const submitForm = (event) => {
    event.preventDefault();

    const options = {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    };

    fetch(url, options)
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
          return true;
        }
      })
      .then(() => {
        window.location = '/';
      })
      .catch((error) => {
        setErrorInfo({
          type: 'Authorization error',
          message: error,
        });
        setShowModalError(true);
      });
  };

  return (
    <header className="page-header " data-test="appHeader">
      <div className="page-header__container app-header">
        <h1 className="visually-hidden">{t('schedules')}</h1>
        <div className="page-header__inner">
          <div className="page-header__top">
            <NavLink
              to="/"
              className="page-header__logo"
              aria-label="main_page_logo"
              exact
            >
              <img
                data-testid="logo-element"
                src={logo}
                width="80"
                height="50"
                alt="Logo Schedule"
              />
            </NavLink>
            <nav className="main-nav" aria-label="main menu">
              <ul className="main-nav__list main-nav__list--main">
                <li className="main-nav__item">
                  <button
                    aria-label="main_nav_button_rus_on"
                    className="main-nav__button"
                    onClick={() => changeLanguage('ru')}
                  >
                    <span>rus</span>
                  </button>
                  <button
                    aria-label="main_nav_button_eng_on"
                    className="main-nav__button"
                    onClick={() => changeLanguage('en')}
                  >
                    <span>eng</span>
                  </button>
                </li>
                {signedIn ? (
                  <Fragment>
                    <li className="main-nav__item">
                      <NavLink
                        to="/users"
                        className="page-header__link"
                        aria-label="main_page_users"
                        exact
                      >
                        {t('users')}
                      </NavLink>
                    </li>
                    <li className="main-nav__item">
                      <NavLink
                        to="/schedules"
                        className="page-header__link"
                        aria-label="main_page_schedules"
                        exact
                      >
                        {t('schedules')}
                      </NavLink>
                    </li>
                  </Fragment>
                ) : null}
              </ul>
              <div className="main-nav__user">
                <ul className="main-nav__list main-nav__list--user">
                  {!signedIn ? (
                    <Fragment>
                      <li className="main-nav__item main-nav__item--singin">
                        <NavLink
                          to="/login"
                          className="page-header__link"
                          aria-label="main_page_signin"
                          exact
                        >
                          {t('SignIn')}
                        </NavLink>
                      </li>
                      <li className="main-nav__item main-nav__item--singup">
                        <NavLink
                          to="/registration"
                          className="page-header__link"
                          aria-label="main_page_signup"
                          exact
                        >
                          {t('SignUp')}
                        </NavLink>
                      </li>
                    </Fragment>
                  ) : null}
                  {signedIn ? (
                    <Fragment>
                      <li className="main-nav__item main-nav__item--singup">
                        <NavLink
                          to="/admin"
                          className="page-header__link"
                          aria-label="main_page_account"
                          exact
                        >
                          {t('account')}
                        </NavLink>
                      </li>
                      <li>
                        <button
                          aria-label="main_page_logout"
                          className="button"
                          onClick={(e) => {
                            submitForm(e);
                          }}
                        >
                          {t('logout')}
                        </button>
                      </li>
                    </Fragment>
                  ) : null}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <ModalErrorWindow />
      <div className="page-header__margin"></div>
    </header>
  );
}

const mapStateToProps = (state) => {
  return {
    authorizationAdmin: state.authorizationObj,
  };
};

Header.propTypes = {
  authorization: func,
};

export {Header};

export default connect(mapStateToProps, {authorization})(Header);
