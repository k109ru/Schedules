import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {string, object, array, func} from 'prop-types';
import {useTranslation} from 'react-i18next';

import {useMutation} from 'react-apollo';
import {UPDATE_SCHEDULE} from '../../queries';
import Loader from '../../components/Loader';

function UpdateEmployee({employee, idSchedule, handleClose}) {
  const {t} = useTranslation();

  const [state, setState] = useState({
    id: employee.id,
    fullname: employee.fullname,
    rateOfWork: employee.rateOfWork,
    hoursOfMonth: employee.hoursOfMonth,
    namePosition: employee.positionOfEmployee.namePosition,
    startWork: employee.positionOfEmployee.hoursOfWork.startWork,
    endWork: employee.positionOfEmployee.hoursOfWork.endWork,
    startSecondWork:
      employee.positionOfEmployee.secondHoursOfWork.startSecondWork,
    endSecondWork: employee.positionOfEmployee.secondHoursOfWork.endSecondWork,
    startLunch: employee.positionOfEmployee.lunch.startLunch,
    endLunch: employee.positionOfEmployee.lunch.endLunch,
    startSecondLunch: employee.positionOfEmployee.secondLunch.startSecondLunch,
    endSecondLunch: employee.positionOfEmployee.secondLunch.endSecondLunch,
    longOfDay: employee.positionOfEmployee.longOfDay,
    fulltime: employee.positionOfEmployee.fulltime,
  });

  const featuresParams = {
    fullname: {type: 'text', title: t('Fullname')},
    rateOfWork: {type: 'text', title: t('Rate of Work')},
    hoursOfMonth: {type: 'text', title: t('Hours of Month')},
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
    fulltime: {type: 'text', title: t('Fulltime')},
  };

  const employeeForUpdate = {
    where: {
      id: state.id,
    },
    data: {
      fullname: state.fullname,
      rateOfWork: parseFloat(state.rateOfWork),
      hoursOfMonth: state.hoursOfMonth,
      positionOfEmployee: {
        update: {
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
        },
      },
      daysOfEmployee: {
        update: [],
      },
    },
  };

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    if (value === '' && name !== 'rateOfWork') {
      value = '0';
    }

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
        <label htmlFor={item}>{featuresParams[item].title} </label>
        <select
          aria-label={`schedule_modal_edit_employee_field_${item}`}
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
        <label htmlFor={item}>{featuresParams[item].title}</label>
        <input
          aria-label={`schedule_modal_edit_employee_field_${item}`}
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
    updateSchedule,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(UPDATE_SCHEDULE);

  if (mutationLoading) {
    return Loader();
  }

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  if (employee) {
    let days = [...employee.daysOfEmployee];
    let daysForUpdate = [];

    days.forEach((day) => {
      daysForUpdate.push({
        where: {id: day.id},
        data: {
          firstStartWork: state.startWork,
          firstStopWork: state.endWork,
          secondStartWork: state.startSecondWork,
          secondStopWork: state.endSecondWork,
        },
      });
    });

    employeeForUpdate.data.daysOfEmployee.update = [...daysForUpdate];
  }

  return (
    <form
      className="modal-form"
      onSubmit={(e) => {
        e.preventDefault();
        updateSchedule({
          variables: {
            idSchedule,
            employees: employeeForUpdate,
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
        aria-label="schedule_modal_edit_employee_submit_button"
        className="button modal__button--submit"
        type="submit"
      >
        {' '}
        {t('Submit')}{' '}
      </button>
    </form>
  );
}

UpdateEmployee.propTypes = {
  id: string,
  employee: object,
  daysOfEmployee: array,
  idSchedule: string,
  handleClose: func,
};

export default UpdateEmployee;
