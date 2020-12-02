import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import uuidv4 from 'uuid/v4';
import {useQuery} from '@apollo/react-hooks';
import {GET_ALL_USERS} from '../../queries';

import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import ModalUser from './ModalUser';
import ModalUserDel from './ModalUserDel';
import ModalAddUser from './ModalAddUser';
import Loader from '../../components/Loader';
import './Users.scss';
import searchIcon from '../../images/search.svg';

function Users({addUser}) {
  const {t} = useTranslation();

  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [showModalAddUser, setShowModalAddUser] = useState(false);

  const [idUser, setIdUser] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [showModalDel, setShowModalDel] = useState(false);

  const [partOfUserName, setPartOfUserName] = useState('');
  const [filteredListOfUsers, setFilteredListOfUsers] = useState([]);

  function ModalWindow() {
    const handleCloseModal = () => {
      setShowModal(false);
    };

    return (
      <main>
        <ModalUser
          show={showModal}
          handleClose={handleCloseModal}
          data={fields}
        ></ModalUser>
      </main>
    );
  }

  function ModalWindowAddUser() {
    const handleCloseModalAddUser = () => {
      setShowModalAddUser(false);
    };

    return (
      <main>
        <ModalAddUser
          show={showModalAddUser}
          handleClose={handleCloseModalAddUser}
        ></ModalAddUser>
      </main>
    );
  }

  function ModalWindowDel() {
    const handleCloseModalDel = () => {
      setShowModalDel(false);
    };

    return (
      <main>
        <ModalUserDel
          show={showModalDel}
          handleClose={handleCloseModalDel}
          id={idUser}
          name={nameUser}
        ></ModalUserDel>
      </main>
    );
  }

  const initialListOfUsers = [];
  const listElementOfUsers = [];

  function handleListOfUsers(event, users) {
    const value = event.target.value.toLowerCase();

    const listElement = [];

    users.forEach((user, index) => {
      if (user.fullname.toLowerCase().includes(value)) {
        listElement.push(
          <tr key={index}>
            <th key={user.id} className="table-user__th">
              {index + 1}
            </th>
            <th
              key={user.id + 'fullname'}
              className="parent-button table-user__th"
            >
              <button
                aria-label={'users_page_update_button_' + user.fullname}
                className="button"
                onClick={() => {
                  setFields([user]);
                  setShowModal(true);
                }}
              >
                {user.fullname}
              </button>
            </th>
            <th key={user.id + 'position'} className="table-user__th">
              {user.position.namePosition}
            </th>
            <th key={user.id + 'rateOfWork'} className="table-user__th">
              {user.rateOfWork}
            </th>
            <th key={user.id + 'longOfDay'} className="table-user__th">
              {user.position.longOfDay}
            </th>
            <th key={user.id + 'fulltime'} className="table-user__th">
              {user.position.fulltime ? t('Yes') : t('No')}
            </th>
            <th key={user.id + 'hoursOfWork'} className="table-user__th">
              {user.position.hoursOfWork.startWork +
                ' - ' +
                user.position.hoursOfWork.endWork}
            </th>
            <th key={user.id + 'secondHoursOfWork'} className="table-user__th">
              {user.position.secondHoursOfWork.startSecondWork +
                ' - ' +
                user.position.secondHoursOfWork.endSecondWork}
            </th>
            <th key={user.id + 'lunch'} className="table-user__th">
              {user.position.lunch.startLunch +
                ' - ' +
                user.position.lunch.endLunch}
            </th>
            <th key={user.id + 'secondLunch'} className="table-user__th">
              {user.position.secondLunch.startSecondLunch +
                ' - ' +
                user.position.secondLunch.endSecondLunch}
            </th>
            <th
              key={user.id + 'delete'}
              className="parent-button table-user__th"
            >
              <button
                aria-label={'users_page_delete_button_' + user.fullname}
                className="button"
                onClick={() => {
                  setIdUser(user.id);
                  setNameUser(user.fullname);
                  setShowModalDel(true);
                }}
              >
                {t('Delete')}
              </button>
            </th>
          </tr>,
        );
        return null;
      }
    });

    setPartOfUserName(value);
    setFilteredListOfUsers(listElement);
  }

  const {loading, error, data, refetch} = useQuery(GET_ALL_USERS, {
    // fetchPolicy: "cache-and-network"
  });

  useEffect(
    () => {
      const fetchData = async () => {
        let result = await refetch();
        if (partOfUserName.length !== 0) {
          const eventForhandler = {
            target: {
              value: partOfUserName,
            },
          };
          handleListOfUsers(eventForhandler, result.data.users);
        }
      };
      fetchData();
    },
    // eslint-disable-next-line
    [
      showModal,
      showModalAddUser,
      showModalDel,
      addUser,
      refetch,
      partOfUserName,
    ],
  );

  if (loading) {
    return Loader();
  }

  if (error) {
    return <Redirect to="/query-error" />;
  }

  if (data) {
    data.users.forEach((user, index) => {
      initialListOfUsers.push(user);

      listElementOfUsers.push(
        <tr key={index}>
          <th key={user.id} className="table-user__th">
            {index + 1}
          </th>
          <th
            key={user.id + 'fullname'}
            className="parent-button table-user__th"
          >
            <button
              aria-label={'users_page_update_button_' + user.fullname}
              className="button"
              onClick={() => {
                setFields([user]);
                setShowModal(true);
              }}
            >
              {user.fullname}
            </button>
          </th>
          <th key={user.id + 'position'} className="table-user__th">
            {user.position.namePosition}
          </th>
          <th key={user.id + 'rateOfWork'} className="table-user__th">
            {user.rateOfWork}
          </th>
          <th key={user.id + 'longOfDay'} className="table-user__th">
            {user.position.longOfDay}
          </th>
          <th key={user.id + 'fulltime'} className="table-user__th">
            {user.position.fulltime ? t('Yes') : t('No')}
          </th>
          <th key={user.id + 'hoursOfWork'} className="table-user__th">
            {user.position.hoursOfWork.startWork +
              ' - ' +
              user.position.hoursOfWork.endWork}
          </th>
          <th key={user.id + 'secondHoursOfWork'} className="table-user__th">
            {user.position.secondHoursOfWork.startSecondWork +
              ' - ' +
              user.position.secondHoursOfWork.endSecondWork}
          </th>
          <th key={user.id + 'lunch'} className="table-user__th">
            {user.position.lunch.startLunch +
              ' - ' +
              user.position.lunch.endLunch}
          </th>
          <th key={user.id + 'secondLunch'} className="table-user__th">
            {user.position.secondLunch.startSecondLunch +
              ' - ' +
              user.position.secondLunch.endSecondLunch}
          </th>
          <th key={user.id + 'delete'} className="parent-button table-user__th">
            <button
              aria-label={'users_page_delete_button_' + user.fullname}
              className="button"
              onClick={() => {
                setIdUser(user.id);
                setNameUser(user.fullname);
                setShowModalDel(true);
              }}
            >
              {t('Delete')}
            </button>
          </th>
        </tr>,
      );
    });

    return (
      <section className="table-users">
        <div className="table-users__func">
          <button
            aria-label="users_page_add_user_button"
            className="button button--add"
            onClick={() => {
              setShowModalAddUser(true);
            }}
          >
            {t('Add User')}
          </button>
          <form className="table-users__search">
            <label className="table-users__label" htmlFor="filter">
              <img
                src={searchIcon}
                width="30"
                height="30"
                alt="search icon"
              ></img>
            </label>
            <input
              aria-label={'users_page_search_user_field'}
              className="table-users__search-field"
              type="text"
              name="filter"
              placeholder={t('Name of user')}
              onChange={(e) => handleListOfUsers(e, initialListOfUsers)}
              value={partOfUserName}
            ></input>
          </form>
        </div>

        <table className="table-user">
          <thead>
            <tr>
              <th key={uuidv4()} className="table-user__th">
                {' '}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('Full Name')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('Position')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('Rate of Work')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('Long Of Day')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('Full time')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('First hours of work')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('Second hours of work')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('First Lunch')}
              </th>
              <th key={uuidv4()} className="table-user__th">
                {t('Second Lunch')}
              </th>
              <th key={uuidv4()}>{t('Delete')}</th>
            </tr>
          </thead>
          <tbody>
            {partOfUserName.length === 0
              ? listElementOfUsers
              : filteredListOfUsers}
          </tbody>
        </table>
        <ModalWindow />
        <ModalWindowDel />
        <ModalWindowAddUser />
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    addUser: state.usersObj,
  };
};

export {Users};

export default connect(mapStateToProps)(Users);
