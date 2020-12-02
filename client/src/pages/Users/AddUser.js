import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {func} from 'prop-types';

import {addedUser} from '../../actions';
import {useTranslation} from 'react-i18next';
import getAdminEmail from '../../utils/getAdminEmail';
import {useMutation} from 'react-apollo';
import {ADD_USER} from '../../queries';
import Loader from '../../components/Loader';
import './AddUser.scss';

function AddUser({addedUser}) {
  const {t} = useTranslation();

  const [state, setState] = useState({
    owner: getAdminEmail() || undefined,
    id: '',
    fullname: '',
    rateOfWork: 0,
    namePosition: '',
    startWork: '0',
    endWork: '0',
    startSecondWork: '0',
    endSecondWork: '0',
    startLunch: '0',
    endLunch: '0',
    startSecondLunch: '0',
    endSecondLunch: '0',
    longOfDay: '0',
    fulltime: true,
  });

  const validateForm = () => {
    const isInvalid = !state.fullname || !state.owner;
    return isInvalid;
  };

  const featuresParams = {
    owner: {type: 'text', title: t('Owner')},
    fullname: {type: 'text', title: t('Fullname')},
    rateOfWork: {type: 'text', title: t('Rate of Work')},
    namePosition: {type: 'text', title: t('Name of Position')},
    startWork: {type: 'text', title: t('Start Work')},
    endWork: {type: 'text', title: t('End Work')},
    startSecondWork: {type: 'text', title: t('Start Second Work')},
    endSecondWork: {type: 'text', title: t('End Second Work')},
    startLunch: {type: 'text', title: t('Start lunch')},
    endLunch: {type: 'text', title: t('End lunch')},
    startSecondLunch: {type: 'text', title: t('Start Second lunch')},
    endSecondLunch: {type: 'text', title: t('End Second lunch')},
    longOfDay: {type: 'text', title: t('Long Of Day')},
    fulltime: {type: 'text', title: t('Full time')},
  };

  const [
    createUser,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(ADD_USER);

  if (mutationLoading) {
    return (
      <div className="add-user">
        <form className="modal-form add-user__form">
          <div className="modal-form--fields">
            {Object.keys(featuresParams).map((item, index) =>
              inputField(item, index),
            )}
          </div>
          <button
            className="button modal__button--submit"
            type="submit"
            disabled={true}
          >
            {t('Add User')}
          </button>
        </form>
        <div className="add-user__loader ">
          <Loader />
        </div>
      </div>
    );
  }

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'fullname':
        setState({
          ...state,
          [name]: value,
        });

        break;
      case 'namePosition':
        setState({
          ...state,
          [name]: value,
        });

        break;

      default:
        setState({
          ...state,
          [name]: value,
        });
    }
  }

  function SelectTypeOfDay(id, item) {
    return (
      <li key={id} className={`modal-form--${item}`}>
        <label aria-label={`form_label_${item}_add_user`} htmlFor={item}>
          {featuresParams[item].title}
        </label>
        <select
          aria-label={`form_input_${item}_add_user`}
          className={`modal-form__item modal-form__item--selectable`}
          name={item}
          value={state.fulltime}
          onChange={(event) =>
            setState({
              ...state,
              fulltime:
                event.target.value.toLowerCase() === 'true' ? true : false,
            })
          }
        >
          <option value={true}>{t('Yes')}</option>
          <option value={false}>{t('No')}</option>
        </select>
        <br />
      </li>
    );
  }

  function inputField(item, id) {
    if (item === 'fulltime') {
      return SelectTypeOfDay(id, item);
    }

    if (item === 'owner') {
      return (
        <li key={id} className={`modal-form--${item} `}>
          <label htmlFor={item}>{featuresParams[item].title}</label>
          <input
            aria-label="form_input_owner_add_user"
            className={`modal-form__item`}
            type={featuresParams[item].type}
            name={item}
            placeholder={t(item)}
            onChange={handleChange}
            value={state[item]}
            disabled
          />
          <br />
        </li>
      );
    }

    return (
      <li key={id} className={`modal-form--${item} `}>
        <label aria-label={`form_label_${item}_add_user`} htmlFor={item}>
          {featuresParams[item].title}
        </label>
        <input
          aria-label={`form_input_${item}_add_user`}
          className={`modal-form__item`}
          type={featuresParams[item].type}
          name={item}
          placeholder={t(item)}
          onChange={handleChange}
          value={state[item]}
        />
        <br />
      </li>
    );
  }

  return (
    <div className="add-user">
      <form
        aria-label="form_add_user"
        className="modal-form add-user__form"
        onSubmit={async (e) => {
          e.preventDefault();
          await createUser({
            variables: {
              owner: state.owner,
              fullname: state.fullname,
              rateOfWork: parseFloat(state.rateOfWork),
              namePosition: state.namePosition,
              startWork: state.startWork,
              endWork: state.endWork,
              startSecondWork: state.startSecondWork,
              endSecondWork: state.endSecondWork,
              startLunch: state.startLunch,
              endLunch: state.endLunch,
              startSecondLunch: state.startSecondLunch,
              endSecondLunch: state.endSecondLunch,
              longOfDay: state.longOfDay,
              fulltime: state.fulltime,
            },
          });
          addedUser([state.fullname]);
        }}
      >
        <div className="modal-form--fields">
          {Object.keys(featuresParams).map((item, index) =>
            inputField(item, index),
          )}
        </div>
        <button
          aria-label="add_user_form_button_add_user"
          className="button modal__button--submit"
          type="submit"
          disabled={validateForm()}
        >
          {t('Add User')}
        </button>
      </form>
    </div>
  );
}

AddUser.propTypes = {
  addedUser: func,
};

export {AddUser};

export default connect(null, {addedUser})(AddUser);
