import React, {useState} from 'react';
import {connect} from 'react-redux';
import {authorization} from '../../actions';

import ModalDelAdmin from './ModalDelAdmin';
import ModalUpdatePassword from './ModalUpdatePassword';

import {useTranslation} from 'react-i18next';

import './Admin.scss';

function Admin() {
  const {t} = useTranslation();

  const [showModalDel, setShowModalDel] = useState(false);
  const [showModalUpdatePassword, setShowModalUpdatePassword] = useState(false);

  function ModalWindowDel() {
    const handleCloseModalDel = () => {
      setShowModalDel(false);
    };

    return (
      <main>
        <ModalDelAdmin
          show={showModalDel}
          handleClose={handleCloseModalDel}
        ></ModalDelAdmin>
      </main>
    );
  }
  function ModalWindowUpdatePassword() {
    const handleCloseModalDel = () => {
      setShowModalUpdatePassword(false);
    };

    return (
      <main>
        <ModalUpdatePassword
          show={showModalUpdatePassword}
          handleClose={handleCloseModalDel}
          email={sessionStorage.getItem('email')}
        ></ModalUpdatePassword>
      </main>
    );
  }

  if (sessionStorage.getItem('signedIn')) {
    return (
      <div className="main-container admin__info">
        <p aria-label="admin_page_welcom_message">
          {' '}
          {t('welcome')} {sessionStorage.getItem('name')}
        </p>
        <p aria-label="admin_page_email_message">
          {' '}
          {t('welcome email')} {sessionStorage.getItem('email')}
        </p>

        <br></br>

        <button
          aria-label="admin_page_update_button"
          className="button admin-button--mr"
          onClick={() => {
            setShowModalUpdatePassword(true);
          }}
        >
          {t('Update password')}
        </button>

        <button
          aria-label="admin_page_delete_button"
          className="button"
          onClick={() => {
            setShowModalDel(true);
          }}
        >
          {t('Delete your account')}
        </button>
        <ModalWindowDel />
        <ModalWindowUpdatePassword />
      </div>
    );
  }

  return (
    <div
      aria-label="admin_page_something_wrong_message"
      className="main-container"
    >
      something went wrong with your authorization
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    authorizationAdmin: state.authorizationObj,
  };
};

export {Admin};

export default connect(mapStateToProps, {authorization})(Admin);
