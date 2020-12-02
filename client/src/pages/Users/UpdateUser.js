import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {func, object, string} from 'prop-types';
import {useTranslation} from 'react-i18next';

import {useMutation} from 'react-apollo';
import {UPDATE_USER} from '../../queries';
import Loader from '../../components/Loader';
import './UpdateUser.scss';

function UpdateUser({user, handleClose}) {
  const {t} = useTranslation();
  const [state, setState] = useState({
    id: user.id,
    fullname: user.fullname,
    rateOfWork: user.rateOfWork,
    namePosition: user.position.namePosition,
    startWork: user.position.hoursOfWork.startWork,
    endWork: user.position.hoursOfWork.endWork,
    startSecondWork: user.position.secondHoursOfWork.startSecondWork,
    endSecondWork: user.position.secondHoursOfWork.startSecondWork,
    startLunch: user.position.lunch.startLunch,
    endLunch: user.position.lunch.endLunch,
    startSecondLunch: user.position.secondLunch.startSecondLunch,
    endSecondLunch: user.position.secondLunch.endSecondLunch,
    longOfDay: user.position.longOfDay,
    fulltime: user.position.fulltime,
  });

  const featuresParams = {
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

  const position = {
    namePosition: state.namePosition,
    hoursOfWork: {
      update: {
        startWork: state.startWork,
        endWork: state.endWork,
      },
    },
    secondHoursOfWork: {
      update: {
        startSecondWork: state.startSecondWork,
        endSecondWork: state.endSecondWork,
      },
    },
    lunch: {
      update: {
        startLunch: state.startLunch,
        endLunch: state.endLunch,
      },
    },
    secondLunch: {
      update: {
        startSecondLunch: state.startSecondLunch,
        endSecondLunch: state.endSecondLunch,
      },
    },
    fulltime: state.fulltime,
    longOfDay: state.longOfDay,
  };

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
        <label aria-label={`form_label_${item}_update_user`} htmlFor={item}>
          {featuresParams[item].title}{' '}
        </label>
        <select
          aria-label={`form_input_${item}_update_user`}
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

    return (
      <li key={id} className={`modal-form--${item} `}>
        <label aria-label={`form_label_${item}_update_user`} htmlFor={item}>
          {featuresParams[item].title}
        </label>
        <input
          aria-label={`form_input_${item}_update_user`}
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

  const [
    updateUser,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(UPDATE_USER);

  if (mutationLoading) {
    return (
      <div className="update-user__loader ">
        <Loader />
      </div>
    );
  }

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  return (
    <form
      data-testid="form_update_user"
      className="modal-form"
      onSubmit={async (e) => {
        e.preventDefault();
        await updateUser({
          variables: {
            id: state.id,
            fullname: state.fullname,
            rateOfWork: parseFloat(state.rateOfWork),
            position,
          },
        });
        handleClose();
      }}
    >
      <div className="modal-form--fields">
        {Object.keys(featuresParams).map((item, index) =>
          inputField(item, index),
        )}
      </div>
      <button
        aria-label="form_update_user_button_submit"
        className="button modal__button--submit"
        type="submit"
      >
        {' '}
        {t('Submit')}{' '}
      </button>
    </form>
  );
}

UpdateUser.propTypes = {
  handleClose: func,
  id: string,
  user: object,
};

export default UpdateUser;
