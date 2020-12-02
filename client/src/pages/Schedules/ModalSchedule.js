import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useMutation} from 'react-apollo';
import {string, bool, number, any, object, func, array} from 'prop-types';

import {UPDATE_SCHEDULE} from '../../queries';

import './ModalSchedule.scss';
import Loader from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const Modal = ({
  handleClose,
  handleChangeValue,
  show,
  children,
  data,
  handleClearSelection,
}) => {
  const {t} = useTranslation();

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  const [state, setState] = useState({
    firstStartWork: data[0].firstStartWork,
    firstStopWork: data[0].firstStopWork,
    secondStartWork: data[0].secondStartWork,
    secondStopWork: data[0].secondStopWork,
    businessTrip: data[0].businessTrip,
    study: data[0].kind.study,
    studyAdd: data[0].kind.studyAdd,
    unknown: data[0].kind.unknown,
    absenteeism: data[0].kind.absenteeism,
    goverment: data[0].kind.goverment,
    holiday: data[0].kind.holiday,
    disease: data[0].kind.disease,
    vacation: data[0].kind.vacation,
    childCare: data[0].kind.childCare,
    admVacation: data[0].kind.admVacation,
    overTime: data[0].kind.overTime,
    nightTime: data[0].kind.nightTime,
    working: data[0].kind.working,
  });

  const feachersParamsWork = {
    firstStartWork: {type: 'text', title: t('1 start work')},
    firstStopWork: {type: 'text', title: t('1 stop work')},
    secondStartWork: {type: 'text', title: t('2 start work')},
    secondStopWork: {type: 'text', title: t('2 stop work')},
  };

  const feachersParams = {
    businessTrip: {type: 'checkbox', title: t('Business Trip (BT)')},
    study: {type: 'checkbox', title: t('Scholastic (S)')},
    studyAdd: {type: 'checkbox', title: t('Addition Scholastic (AS)')},
    unknown: {type: 'checkbox', title: t('Unknown reason (UR)')},
    absenteeism: {type: 'checkbox', title: t('Absenteeism (A)')},
    goverment: {type: 'checkbox', title: t('Manager allow (MA)')},
    holiday: {type: 'checkbox', title: t('Scholastic vacation (SV)')},
    disease: {type: 'checkbox', title: t('Disease (D)')},
    vacation: {type: 'checkbox', title: t('Vacation (V)')},
    childCare: {type: 'checkbox', title: t('Child care (CC)')},
    admVacation: {type: 'checkbox', title: t('Administration vacation (AV)')},
    overTime: {type: 'checkbox', title: t('Overtime (O)')},
    nightTime: {type: 'checkbox', title: t('Night time (NT)')},
    working: {type: 'checkbox', title: t('Working (W)')},
  };

  const employees = [];
  const employeesForSubmit = [];

  if (data.length !== 0) {
    data.forEach((item) => {
      employees.push({
        where: {id: item.idEmployee},
        data: {
          daysOfEmployee: {
            update: [
              {
                where: {id: item.id},
                data: {},
              },
            ],
          },
        },
      });
    });
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (
      name === 'firstStartWork' ||
      name === 'firstStopWork' ||
      name === 'secondStartWork' ||
      name === 'secondStopWork'
    ) {
      setState({
        ...state,
        [name]: value,
      });
    } else {
      setState({
        ...state,
        businessTrip: false,
        study: false,
        studyAdd: false,
        unknown: false,
        absenteeism: false,
        goverment: false,
        holiday: false,
        disease: false,
        vacation: false,
        childCare: false,
        admVacation: false,
        overTime: false,
        nightTime: false,
        working: false,
        [name]: !state[name],
      });
    }
  }

  function inputFieldWork(item, id) {
    return (
      <li key={id} className={`modal-form--${item} `}>
        <label htmlFor={item}>{feachersParamsWork[item].title}</label>
        <input
          aria-label={`schedule_modal_params_work_${item}`}
          className={`modal-form__item schedule-modal__input`}
          type={feachersParamsWork[item].type}
          name={item}
          placeholder={state[item]}
          onChange={handleChange}
          value={state[item]}
        />
        <br />
      </li>
    );
  }

  function inputField(item, id) {
    return (
      <li key={id} className={`modal-form--${item} checkbox__item`}>
        <label htmlFor={item}>{feachersParams[item].title}</label>
        <input
          aria-label={`schedule_modal_params_day_${item}`}
          className={`modal-form__item schedule-modal__checkbox`}
          type={feachersParams[item].type}
          name={item}
          checked={!!state[item]}
          onChange={handleChange}
        />
      </li>
    );
  }

  function fillUpEmployees(arr) {
    const dayTemplate = {
      firstStartWork: state.firstStartWork,
      firstStopWork: state.firstStopWork,
      secondStartWork: state.secondStartWork,
      secondStopWork: state.secondStopWork,
      kind: {
        update: {
          businessTrip: state.businessTrip,
          study: state.study,
          studyAdd: state.studyAdd,
          unknown: state.unknown,
          absenteeism: state.absenteeism,
          goverment: state.goverment,
          holiday: state.holiday,
          disease: state.disease,
          vacation: state.vacation,
          childCare: state.childCare,
          admVacation: state.admVacation,
          overTime: state.overTime,
          nightTime: state.nightTime,
          working: state.working,
        },
      },
    };

    function changeArray(arr) {
      const finalArray = [];

      arr.map((item) => {
        finalArray.push({
          ...item,
          data: dayTemplate,
        });
        return null;
      });
      return finalArray;
    }

    arr.map((item) => {
      employeesForSubmit.push({
        ...item,
        data: {
          daysOfEmployee: {
            update: changeArray(item.data.daysOfEmployee.update),
          },
        },
      });
      return null;
    });
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

  return (
    <div
      aria-label="schedule_modal_edit_chosen_field"
      className={`${showHideClassName}`}
    >
      <div className="modal-main modal">
        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            fillUpEmployees(employees);
            updateSchedule({
              variables: {
                idSchedule: data[0].idSchedule,
                employees: employeesForSubmit,
              },
            });
            handleChangeValue();
            handleClearSelection();
            handleClose();
          }}
        >
          <button
            aria-label="schedule_modal_edit_close_button"
            className="button modal__button--close"
            type="button"
            onClick={() => {
              handleClearSelection();
              handleClose();
            }}
          >
            {t('Close')}
          </button>
          <div>
            <p
              aria-label="schedule_modal_number_days"
              className={`schedule-modal__title `}
            >
              {t('You have chosen')} {data.length} {t('days')}.
            </p>
            {children}
            <ul className="modal-form--fields">
              {Object.keys(feachersParamsWork).map((item, index) =>
                inputFieldWork(item, index),
              )}
            </ul>
            <ul className="modal-form--fields schedule-modal__checkboxes">
              {Object.keys(feachersParams).map((item, index) =>
                inputField(item, index),
              )}
            </ul>
          </div>
          <button
            aria-label="schedule_modal_submit_button"
            className="button modal__button--submit"
            type="submit"
          >
            {t('Submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

Modal.propTypes = {
  handleClose: func,
  data: array,
  show: bool,
  handleChangeValue: func,
  handleClearSelection: func,
  children: any,
  selectableRef: any,
  isSelected: any,
  isSelecting: any,
  notselect: string,
  day: object,
  isChecked: bool,
  num: number,
  kind: object,
  businessTrip: bool,
  study: bool,
  studyAdd: bool,
  unknown: bool,
  absenteeism: bool,
  goverment: bool,
  holiday: bool,
  disease: bool,
  vacation: bool,
  childCare: bool,
  admVacation: bool,
  overTime: bool,
  nightTime: bool,
  working: bool,
  weekday: bool,
  fullname: string,
  firstStartWork: string,
  firstStopWork: string,
  beforeHoliday: bool,
  secondStartWork: string,
  secondStopWork: string,
  weekend: bool,
  fulltime: bool,
  selectable: any,
};

export default Modal;
