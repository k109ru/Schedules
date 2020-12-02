import React, {useState, useEffect} from 'react';
import {useMutation, useQuery} from 'react-apollo';
import {Redirect} from 'react-router-dom';

import getAdminEmail from '../../utils/getAdminEmail';
import {ADD_SCHEDULE, GET_ALL_USERS} from '../../queries';

import {useTranslation} from 'react-i18next';
import getYearMonthDays from '../../utils/getYearMonthDays';

import './AddSchedule.scss';
import Loader from '../../components/Loader';

function AddSchedule() {
  const {t} = useTranslation();

  const [state, setState] = useState({
    nameSchedule: '',
    owner: getAdminEmail(),
    theader: '',
    year: getYearMonthDays().year,
    nameOfMonth: getYearMonthDays().month,
    daysOfMonth: getYearMonthDays().days,
    weekdays: getYearMonthDays().weekdays,
    weekends: getYearMonthDays().weekends,
    holidays: getYearMonthDays().holidays,
    beforeHolidays: getYearMonthDays().holidays,
    typeOfWeek: 8,
    amountOfWorkingHours: 0,
    countOfWeekdays: 0,
  });

  const [mount, setMount] = useState(false);

  const [changedUser, setChangedUser] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [fetchedUsers, setFetchedUsers] = useState([]);

  const [infoWindow, setInfoWindow] = useState(false);

  useEffect(
    () => {
      let timerShowMessage = setTimeout(() => {
        setInfoWindow(false);
      }, 3000);

      if (employees.length !== 0 && !mount) {
        setMount(true);
        const arrModeEmployees = [];
        employees.forEach((employee) => {
          const hoursOfWork =
            employee.positionOfEmployee.create.hoursOfWork.create;
          const secondHoursOfWork =
            employee.positionOfEmployee.create.secondHoursOfWork.create;
          arrModeEmployees.push({
            ...employee,
            daysOfEmployee: {
              create: daysForQuery(hoursOfWork, secondHoursOfWork),
            },
            hoursOfMonth: state.amountOfWorkingHours.toString(),
          });
        });
        setEmployees([...arrModeEmployees]);
      }

      return () => {
        clearTimeout(timerShowMessage);
      };
    },
    // eslint-disable-next-line
    [
      state.weekdays,
      state.weekends,
      state.holidays,
      state.beforeHolidays,
      changedUser,
      state.amountOfWorkingHours,
      mount,
      employees,
    ],
  );

  function ScheduleAdded() {
    return (
      <div className="add-schedule__help-info">
        <p>
          {t('The schedule')}{' '}
          <span className="help-info__schedule-name">
            {state.nameSchedule}{' '}
          </span>
          {t('was created successfully')}.
        </p>
        <p>{t('Check your list of schedules')}.</p>
      </div>
    );
  }

  const featuresParamsForHeader = {
    nameSchedule: {
      type: 'text',
      title: t('Name for your schedule'),
      placeholder: t('Name for your schedule'),
    },
    theader: {
      type: 'text',
      title: t('Title of table header'),
      placeholder: t('The header for your table'),
    },
  };

  const featuresParams = {
    typeOfWeek: {type: 'text', title: t('Type of week hours')},
    amountOfWorkingHours: {
      type: 'text',
      title: t('Amount of working hours per month'),
    },
  };

  const featuresParamsForDays = {
    weekdays: {type: 'checkbox', title: t('Amount of weekdays')},
    weekends: {type: 'checkbox', title: t('Amount of weekends')},
    holidays: {type: 'checkbox', title: t('Amount of holidays')},
    beforeHolidays: {
      type: 'checkbox',
      title: t('Amount of days before holidays'),
    },
  };

  const validateForm = () => {
    const isInvalid = !state.year || !state.nameOfMonth;
    return isInvalid;
  };

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'amountOfWorkingHours':
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

  function SelectTypeOfWeek(id, item) {
    function handleChange(event) {
      setState({
        ...state,
        typeOfWeek: parseFloat(event.target.value),
      });
    }

    return (
      <label key={id} className={`add-schedule__fields-label`} htmlFor={item}>
        {featuresParams[item].title}
        <select
          aria-label={`add_schedule_feature_header_${[item]}`}
          className={`add-schedule__fields-item add-schedule__fields-item--selectable`}
          name={item}
          value={state.typeOfWeek}
          onChange={handleChange}
        >
          <option value="8.0">8 {t('hours week')}</option>
          <option value="7.8">7.8 {t('hours week')}</option>
          <option value="7.2">7.2 {t('hours week')}</option>
        </select>
      </label>
    );
  }

  function Checkboxes(label) {
    const arrayOfItems = state[label].map((item) => {
      return (
        <label
          key={item.id}
          htmlFor={item.id}
          className="add-schedule__day day-container"
        >
          <span className="day-container__number">{item.num}</span>
          <input
            aria-label={`add_schedule_check_day_input_${label}`}
            type="checkbox"
            name={item.id}
            value={item.num}
            checked={item.isChecked}
            onChange={(e) => toggleCheckboxChange(e, label)}
          />
          <span className="checkmark"></span>
        </label>
      );
    });

    function toggleCheckboxChange(e, label) {
      const value = e.target.value;
      const arrLabel = [...state[label]];
      const isChecked = arrLabel[value - 1].isChecked;
      arrLabel[value - 1].isChecked = !isChecked;

      setState({
        ...state,
        [label]: arrLabel,
      });

      const numWeekday = new Date(
        state.year,
        getYearMonthDays().monthNum,
        value,
      ).getDay();

      if (label === 'holidays') {
        const arrForCheckWeekdays = [...state.weekdays];
        const isCheckedWD = arrForCheckWeekdays[value - 1].isChecked;
        if (!isCheckedWD & (numWeekday === 0) || numWeekday === 6) {
          arrForCheckWeekdays[value - 1].isChecked = false;
        } else {
          arrForCheckWeekdays[value - 1].isChecked = !isCheckedWD;
        }

        setState({
          ...state,
          weekdays: arrForCheckWeekdays,
        });
      }
    }

    return arrayOfItems;
  }

  function inputField(item, id) {
    if (item === 'typeOfWeek') {
      return SelectTypeOfWeek(id, item);
    }

    return (
      <label key={id} className={`add-schedule__fields-label`} htmlFor={item}>
        {featuresParams[item].title}
        <input
          aria-label={`add_schedule_feature_header_${[item]}`}
          className={`add-schedule__fields-item`}
          type={featuresParams[item].type}
          name={item}
          placeholder={
            featuresParams[item].placeholder
              ? featuresParams[item].placeholder
              : t(item)
          }
          onChange={handleChange}
          value={state[item]}
        />
      </label>
    );
  }

  function inputFieldForHeader(item, id) {
    return (
      <label key={id} className={`add-schedule__fields-label`} htmlFor={item}>
        {featuresParamsForHeader[item].title}
        <input
          aria-label={`add_schedule_feature_header_${item}`}
          className={`add-schedule__fields-item`}
          type={featuresParamsForHeader[item].type}
          name={item}
          placeholder={
            featuresParamsForHeader[item].placeholder
              ? featuresParamsForHeader[item].placeholder
              : item
          }
          onChange={handleChange}
          value={state[item]}
        />
      </label>
    );
  }

  function inputFieldForMonth() {
    return (
      <div key={12341234}>
        <p aria-label="add_schedule_colored_days">
          <AutoCreateDays />
        </p>
      </div>
    );
  }

  function inputFieldForDays(item, id) {
    return (
      <div key={id} className="add-schedule__item--days days">
        <p className="days__title">{featuresParamsForDays[item].title}</p>
        <div className="days__list">{Checkboxes(item)}</div>
      </div>
    );
  }

  function AutoCreateDays() {
    const beforeHolidayColor = 'days__day days__day--before-holiday';
    const holidayColor = 'days__day days__day--holiday';
    const weekdayColor = 'days__day days__day--weekday';
    const weekendColor = 'days__day days__day--weekend';
    const arrayOfDays = [];
    const arrayOfDays2 = [];

    for (let i = 0; i < state.daysOfMonth; i++) {
      arrayOfDays.push(i + 0);
    }

    arrayOfDays.forEach((item, index) => {
      if (state.weekdays[index].isChecked) {
        const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
        arrayOfDays2[index] = (
          <i
            aria-label="add_schedule_item_colored_days"
            key={id}
            className={weekdayColor}
          >
            {index + 1}{' '}
          </i>
        );
      }
    });

    arrayOfDays.forEach((item, index) => {
      if (state.weekends[index].isChecked) {
        const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
        arrayOfDays2[index] = (
          <i
            aria-label="add_schedule_item_colored_days"
            key={id}
            className={weekendColor}
          >
            {index + 1}{' '}
          </i>
        );
      }
    });

    arrayOfDays.forEach((item, index) => {
      if (state.holidays[index].isChecked) {
        const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
        arrayOfDays2[index] = (
          <i
            aria-label="add_schedule_item_colored_days"
            key={id}
            className={holidayColor}
          >
            {index + 1}{' '}
          </i>
        );
      }
    });

    arrayOfDays.forEach((item, index) => {
      if (state.beforeHolidays[index].isChecked) {
        const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
        arrayOfDays2[index] = (
          <i
            aria-label="add_schedule_item_colored_days"
            key={id}
            className={beforeHolidayColor}
          >
            {index + 1}{' '}
          </i>
        );
      }
    });

    return <React.Fragment>{arrayOfDays2}</React.Fragment>;
  }

  function daysForQuery(hoursOfWork, secondHoursOfWork) {
    const daysArr = [...Array(getYearMonthDays().days).keys()];
    const arrOfDays = [];

    daysArr.forEach((day, index) => {
      arrOfDays.push({
        number: index + 1,
        weekday: state.weekdays[index].isChecked,
        weekend: state.weekends[index].isChecked,
        holiday: state.holidays[index].isChecked,
        beforeHoliday: state.beforeHolidays[index].isChecked,
        firstStartWork: hoursOfWork.startWork,
        firstStopWork: hoursOfWork.endWork,
        secondStartWork: secondHoursOfWork.startSecondWork,
        secondStopWork: secondHoursOfWork.endSecondWork,
        kind: {
          create: {
            working: true,
          },
        },
      });
    });

    return arrOfDays;
  }

  function createEmployee(user = {}) {
    const userToEmployee = {
      fullname: user.fullname,
      rateOfWork: user.rateOfWork,
      positionOfEmployee: {
        create: {
          namePosition: user.position.namePosition,
          hoursOfWork: {
            create: {
              startWork: user.position.hoursOfWork.startWork,
              endWork: user.position.hoursOfWork.endWork,
            },
          },
          secondHoursOfWork: {
            create: {
              startSecondWork: user.position.secondHoursOfWork.startSecondWork,
              endSecondWork: user.position.secondHoursOfWork.endSecondWork,
            },
          },
          lunch: {
            create: {
              startLunch: user.position.lunch.startLunch,
              endLunch: user.position.lunch.endLunch,
            },
          },
          secondLunch: {
            create: {
              startSecondLunch: user.position.secondLunch.startSecondLunch,
              endSecondLunch: user.position.secondLunch.endSecondLunch,
            },
          },
          fulltime: user.position.fulltime,
          longOfDay: user.position.longOfDay,
        },
      },
      daysOfEmployee: {
        create: daysForQuery(
          user.position.hoursOfWork,
          user.position.secondHoursOfWork,
        ),
      },
    };
    return userToEmployee;
  }

  const {loading, error, data} = useQuery(GET_ALL_USERS, {errorPolicy: 'all'});

  if (data && fetchedUsers.length === 0) {
    data.users.map((user) => {
      const employee = createEmployee(user);
      employees.push(employee);

      fetchedUsers.push({
        ...employee,
        isChecked: true,
        id: user.id,
      });
      return null;
    });
  }

  const chooseUser = (id) => {
    // const forEmployees = [];
    const changedUsers = [...fetchedUsers];
    const forUsersArr = [];

    fetchedUsers.map((user, index) => {
      if (user.id === id) {
        changedUsers[index].isChecked = !user.isChecked;

        if (user.isChecked) {
          const modUser = {
            ...user,
          };

          delete modUser.id;
          delete modUser.isChecked;

          forUsersArr.push(modUser);
        }

        setFetchedUsers(changedUsers);
      } else if (user.isChecked) {
        const modUser = {
          ...user,
        };

        delete modUser.id;
        delete modUser.isChecked;
        forUsersArr.push(modUser);
      }

      return null;
    });

    setEmployees(forUsersArr);
    setChangedUser(!changedUser);
    //It clear forUsersArr
    forUsersArr.push();
  };

  const chooseUsersAll = () => {
    const changedUsers = [...fetchedUsers];
    const forUsersArr = [];

    fetchedUsers.map((user, index) => {
      changedUsers[index].isChecked = true;

      const modUser = {
        ...user,
      };

      delete modUser.id;
      delete modUser.isChecked;
      forUsersArr.push(modUser);

      setFetchedUsers(changedUsers);
      setEmployees(forUsersArr);
      setChangedUser(!changedUser);
      forUsersArr.push();
      return null;
    });
  };

  const chooseUsersClear = () => {
    const changedUsers = [...fetchedUsers];
    const forUsersArr = [];

    fetchedUsers.map((user, index) => {
      changedUsers[index].isChecked = false;
      setFetchedUsers(changedUsers);
      setEmployees(forUsersArr);
      setChangedUser(!changedUser);
      forUsersArr.push();
      return null;
    });
  };

  function ListOfUsers() {
    if (fetchedUsers.length > 0) {
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>{t('List of users')}</th>
              </tr>
            </thead>
            <tbody>
              {fetchedUsers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <th
                      aria-label="add_schedule_user_list_item"
                      className="user-item"
                    >
                      <input
                        aria-label={`add_schedule_list_user_${user.fullname}`}
                        type="checkbox"
                        name={user.id}
                        id={user.id}
                        checked={user.isChecked}
                        onChange={(event) => {
                          chooseUser(event.target.name);
                        }}
                      />
                      <label
                        className={`${
                          user.isChecked
                            ? 'user-item__label--active'
                            : 'user-item__label'
                        } `}
                        htmlFor={user.id}
                        id={user.id}
                      >
                        {index + 1}. {user.fullname}
                      </label>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="users-buttons">
            <button
              aria-label="add_schedule_user_list_button_select_all"
              onClick={chooseUsersAll}
              className="button"
            >
              {t('Select All')}
            </button>
            <button
              aria-label="add_schedule_user_list_button_clear_all"
              onClick={chooseUsersClear}
              className="button"
            >
              {t('Clear All')}
            </button>
          </div>
        </div>
      );
    } else {
      return <div>{Loader()}</div>;
    }
  }

  function ListOfChosenUsers() {
    if (employees.length > 0) {
      return (
        <React.Fragment>
          {fetchedUsers.map((user) => {
            if (user.isChecked) {
              return (
                <tr aria-label="add_schedule_table_user_item" key={user.id}>
                  <th className="schedule-create__th">{user.fullname}</th>
                  <th className="schedule-create__th">
                    {user.positionOfEmployee.create.namePosition}
                  </th>
                  <th className="schedule-create__th">{user.rateOfWork}</th>
                  <th className="schedule-create__th">
                    {
                      user.positionOfEmployee.create.hoursOfWork.create
                        .startWork
                    }{' '}
                    -{' '}
                    {user.positionOfEmployee.create.hoursOfWork.create.endWork}
                  </th>
                  <th className="schedule-create__th">
                    {
                      user.positionOfEmployee.create.secondHoursOfWork.create
                        .startSecondWork
                    }{' '}
                    -{' '}
                    {
                      user.positionOfEmployee.create.secondHoursOfWork.create
                        .endSecondWork
                    }
                  </th>
                  <th className="schedule-create__th">
                    {user.positionOfEmployee.create.lunch.create.startLunch} -{' '}
                    {user.positionOfEmployee.create.lunch.create.endLunch}
                  </th>
                  <th className="schedule-create__th">
                    {
                      user.positionOfEmployee.create.secondLunch.create
                        .startSecondLunch
                    }{' '}
                    -{' '}
                    {
                      user.positionOfEmployee.create.secondLunch.create
                        .endSecondLunch
                    }
                  </th>
                  <th className="schedule-create__th">
                    {user.positionOfEmployee.create.fulltime
                      ? t('Yes')
                      : t('No')}
                  </th>
                  <th className="schedule-create__th">
                    {user.positionOfEmployee.create.longOfDay}
                  </th>
                </tr>
              );
            }
            return null;
          })}
        </React.Fragment>
      );
    } else {
      return (
        <tr>
          <th colSpan="10">{t("You don't choose any user yet.")}</th>
        </tr>
      );
    }
  }

  const [
    createSchedule,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(ADD_SCHEDULE, {onError: () => null});

  if (mutationLoading) return Loader();

  if (error) {
    return <Redirect to="/query-error" />;
  }

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  return (
    <div className="add-schedule">
      {infoWindow ? ScheduleAdded() : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSchedule({
            variables: {
              ...state,
              amountOfWorkingHours: parseFloat(state.amountOfWorkingHours),
              employees,
            },
          });

          setInfoWindow(true);
        }}
      >
        <div>
          <h1 aria-label="add_schedule_title" className="add-schedule__header">
            {t('The schedule for')} {t(state.nameOfMonth)} {state.year}.
          </h1>
        </div>
        <div className="add-schedule__fields">
          <div className="add-schedule__fields-items">
            {Object.keys(featuresParamsForHeader).map((item, index) =>
              inputFieldForHeader(item, index),
            )}
          </div>
          <div className="add-schedule__fields-items">
            {Object.keys(featuresParams).map((item, index) =>
              inputField(item, index),
            )}
          </div>
        </div>
        <div>
          {Object.keys(featuresParamsForDays).map((item, index) =>
            inputFieldForDays(item, index),
          )}
        </div>
        <div className="add-schedule__month">{inputFieldForMonth()}</div>
        <div className="add-schedule__list-users">
          <div className="add-schedule__item-users--chosen">
            <table className="add-schedule__table-users">
              <thead>
                <tr>
                  <th colSpan="10">
                    {state.theader.length !== 0
                      ? state.theader
                      : t('The header of your table')}
                  </th>
                </tr>
                <tr>
                  <th className="schedule-create__th">{t('Full Name')}</th>
                  <th className="schedule-create__th">{t('Position')}</th>
                  <th className="schedule-create__th">{t('Rate of Work')}</th>
                  <th className="schedule-create__th">{t('First hours')}</th>
                  <th className="schedule-create__th">{t('Second hours')}</th>
                  <th className="schedule-create__th">{t('First lunch')}</th>
                  <th className="schedule-create__th">{t('Second lunch')}</th>
                  <th className="schedule-create__th">{t('Full time')}</th>
                  <th className="schedule-create__th">{t('Long of day')}</th>
                </tr>
              </thead>
              <tbody>
                <ListOfChosenUsers />
              </tbody>
            </table>
          </div>
          <div className="add-schedule__item-users">
            <ListOfUsers />
            {loading ? Loader() : null}
          </div>
        </div>
        <button
          aria-label="add_schedule_button_add_schedule"
          className="button"
          type="submit"
          disabled={mutationLoading || validateForm()}
        >
          {t('Add Schedule')}
        </button>
      </form>
    </div>
  );
}

export default AddSchedule;
