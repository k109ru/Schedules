import React, {useState, useEffect, useRef} from 'react';
import {SelectableGroup, SelectAll, DeselectAll} from 'react-selectable-fast';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {string, number, object, array} from 'prop-types';
import {useTranslation} from 'react-i18next';

import i18n from '../../i18n';

import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_SCHEDULE, DELETE_EMPLOYEE} from '../../queries';

import {timeStringToNumber, hoursToString} from '../../utils/calculateTime';
import calculateWorkingTime from '../../utils/calculateWorkingTime';
import fetchOdtDoc from '../../utils/fetchOdtDoc';
import AddDay from './AddDay';

import Modal from './ModalSchedule';
import ModalZero from './ModalScheduleZero';
import ModalScheduleDel from './ModalScheduleDel';
import ModaAddEmployee from './ModalAddEmployee';
import ModalEditOfEmployee from './ModalEditOfEmployee';
import Loader from '../../components/Loader';

import './Schedule.scss';

function Schedule({match, addEmployee, req}) {
  const {t} = useTranslation();
  const adminEmail = sessionStorage.getItem('email');
  const [showLoader, setShowLoader] = useState(false);

  const idSchedule = match.params.id;
  const [toSchedules] = useState(false);
  let editingFields = [];
  const [fields, setFields] = useState([]);
  const [id, setIdSchedule] = useState(idSchedule);

  if (match.params.id !== id) {
    setIdSchedule(match.params.id);
  }

  const [showModal, setShowModal] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);
  const [showModalAddEmployee, setShowModalAddEmployee] = useState(false);
  const [showModalEditOfEmployee, setShowModalEditOfEmployee] = useState(false);
  const [employeeForUpdate, setEmployeeForUpdate] = useState({});
  const [somethingChange, setSomeThingChange] = useState(false);
  const buttonRef = useRef(null);

  function ModalWindow() {
    const handleOpenModal = (arr) => {
      setFields([...arr]);
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleChange = () => {
      setSomeThingChange(!somethingChange);
    };

    const handleSelection = () => {
      buttonRef.current.click();
    };

    if (fields.length === 0) {
      return (
        <main>
          <ModalZero
            show={showModal}
            handleClose={handleCloseModal}
          ></ModalZero>
          <button
            aria-label="schedule_page_button_edit_chosen_field"
            className="button menu__item"
            type="button"
            onClick={() => handleOpenModal(editingFields)}
          >
            {t('Edit chosen field')}
          </button>
        </main>
      );
    }

    return (
      <main>
        <Modal
          show={showModal}
          handleClose={handleCloseModal}
          handleChangeValue={handleChange}
          data={fields}
          handleClearSelection={handleSelection}
        ></Modal>
        <button
          aria-label="schedule_page_button_edit_chosen_field"
          className="button menu__item"
          type="button"
          onClick={() => handleOpenModal(editingFields)}
        >
          {t('Edit chosen field')}
        </button>
      </main>
    );
  }

  function ModalWindowAddEmployee(props) {
    const handleCloseModalAddEmployee = () => {
      setShowModalAddEmployee(false);
    };

    return (
      <main>
        <ModaAddEmployee
          show={showModalAddEmployee}
          handleClose={handleCloseModalAddEmployee}
          id={idSchedule}
          name={props.name}
        ></ModaAddEmployee>
        <button
          aria-label="schedule_page_button_add_employee"
          className="button menu__item"
          type="button"
          onClick={() => setShowModalAddEmployee(true)}
        >
          {t('Add Employee')}
        </button>
      </main>
    );
  }

  function ModalWindowDel(props) {
    const handleCloseModalDel = () => {
      setShowModalDel(false);
    };

    return (
      <main>
        <ModalScheduleDel
          show={showModalDel}
          handleClose={handleCloseModalDel}
          id={idSchedule}
          name={props.name}
        ></ModalScheduleDel>
        <button
          aria-label="schedule_page_button_delete_schedule"
          className="button menu__item"
          type="button"
          onClick={() => setShowModalDel(true)}
        >
          {t('Delete the schedule')}
        </button>
      </main>
    );
  }

  function ModalWindowEmployee(props) {
    const handleCloseModalEdit = () => {
      setShowModalEditOfEmployee(false);
    };

    return (
      <main>
        <ModalEditOfEmployee
          show={showModalEditOfEmployee}
          handleClose={handleCloseModalEdit}
          id={idSchedule}
          employee={props.employee}
        ></ModalEditOfEmployee>
      </main>
    );
  }

  const sumBeforeHolidays = (array) => {
    let count = 0;
    array.forEach((item) => {
      if (item.isChecked) {
        count = count + 1;
      }
    });
    return count;
  };

  const calculationTotalData = (data) => {
    const result = {
      plan: 0,
      workingHours: 0,
      mustBe: 0,
      check: false,
    };

    const checkData = () => {
      if (result.workingHours * 1 === result.mustBe && result.mustBe !== 0) {
        result.check = true;
      } else {
        result.check = false;
      }
    };

    result.plan =
      data.hoursOfMonth * (data.rateOfWork === 0 ? 1 : data.rateOfWork);
    result.workingHours =
      parseFloat(
        calculateWorkingTime(
          data.daysOfEmployee,
          data.employee,
        ).workingHours.toFixed(1),
      ) * (data.rateOfWork === 0 ? 1 : data.rateOfWork);

    if (data.fulltime) {
      result.mustBe = parseFloat(
        (
          data.hoursOfMonth * (data.rateOfWork === 0 ? 1 : data.rateOfWork) -
          calculateWorkingTime(
            data.daysOfEmployee,
            data.employee,
          ).nameHours.toFixed(1) *
            (data.rateOfWork === 0 ? 1 : data.rateOfWork)
        ).toFixed(1),
      );
    } else {
      result.mustBe = parseFloat(
        (
          data.hoursOfMonth * (data.rateOfWork === 0 ? 1 : data.rateOfWork) -
          calculateWorkingTime(
            data.daysOfEmployee,
            data.employee,
          ).nameHours.toFixed(1) *
            (data.rateOfWork === 0 ? 1 : data.rateOfWork)
        ).toFixed(1),
      );
    }

    checkData();

    return result;
  };

  const calcTypeOfDays = (obj) => {
    const array = [];

    Object.values(obj).forEach((item) => {
      array.push(`${t(item.name)}:${item.value}`);
    });

    return (
      <div>
        {array.map((el, index) => (
          <div key={index + el}>{el}</div>
        ))}
      </div>
    );
  };

  // const calcResult = (data) => {
  //   if (data.fulltime) {
  //     let v = 0;
  //     const sumDays = (arrayDays) => {
  //       const allCount = {
  //         allDays: 0,
  //         beforeHoliday: 0,
  //         allDaysKind: 0,
  //         beforeHolidayKind: 0,
  //       };

  //       arrayDays.map((item) => {
  //         if (!item.kind.working) {
  //           allCount.allDaysKind++;

  //           if (item.beforeHoliday) {
  //             allCount.beforeHolidayKind++;
  //           }
  //         }
  //       });

  //       arrayDays.map((item) => {
  //         if (item.kind.working) {
  //           allCount.allDays++;

  //           if (item.beforeHoliday) {
  //             allCount.beforeHoliday++;
  //           }
  //         }
  //       });

  //       return allCount;
  //     };

  //     if (sumDays(data.days).allDaysKind !== 0) {
  //       v =
  //         sumDays(data.days).allDays * data.typeOfWeek -
  //         sumDays(data.days).beforeHoliday;
  //     }

  //     return data.plan - v;
  //   }

  //   if (!data.fulltime) {
  //     let v = 0;
  //     let working = 0;
  //     const sumDays = (arrayDays) => {
  //       const allCount = {
  //         allDays: 0,
  //         beforeHoliday: 0,
  //       };

  //       arrayDays.map((item) => {
  //         if (!item.kind.working) {
  //           allCount.allDays++;

  //           if (item.beforeHoliday) {
  //             allCount.beforeHoliday++;
  //           }
  //         }
  //       });

  //       return allCount;
  //     };

  //     if (sumDays(data.days).allDays !== 0) {
  //       v = sumDays(data.days).allDays * data.longOfDay;
  //     }

  //     if (sumDays(data.days).beforeHoliday !== 0) {
  //       v =
  //         sumDays(data.days).allDays * data.longOfDay -
  //         sumDays(data.days).beforeHoliday;
  //     }

  //     return data.plan - v;
  //   }
  // };

  // const checkTotal = (data) => {
  //   if (data.fulltime) {
  //     if (data.working === 0 && data.vacation === 0) {
  //       return false;
  //     }

  //     if (data.rate !== 1) {
  //       if (
  //         data.working + data.vacation === data.all / data.rate &&
  //         data.all / data.rate + data.vacation ===
  //           (data.total - data.sumBeforeHolidays) * data.rate
  //       ) {
  //         return true;
  //       }
  //     }

  //     if (
  //       data.working + data.vacation === data.all &&
  //       data.all + data.vacation === data.total * data.rate
  //     ) {
  //       return true;
  //     }
  //     return false;
  //   } else {
  //     if (data.working + data.vacation === data.total) {
  //       return true;
  //     }
  //     return false;
  //   }
  // };

  function handleSelectionFinish(arr) {
    editingFields = [];
    arr.map((item) => {
      editingFields.push(item.props);
      return null;
    });
  }

  function FirstTabelRow(month, amountOfWorkingHours, typeOfWeek) {
    const arrDays = [...Array(month.daysAmount).keys()].map((item, index) => {
      return (
        <AddDay
          key={index}
          day={month.weekdays[index]}
          num={index + 1}
          notselect={'not-selectable'}
        />
      );
    });

    return (
      <tr className="schedule__table-thead">
        <th key={id} className="schedule-tables__th">
          <span className="delete--rot">{t('Delete')}</span>
        </th>
        <th key={id + 'fullname'} className="schedule-tables__th">
          <p>{t('Full Name')}</p>
          <p>/</p>
          <p>{t('Edit')}</p>
        </th>
        <th key={id + 'position'} className="schedule-tables__th">
          <p>{t('Position')}</p>
          <hr></hr>
          <p>{t('Rate of Work')}</p>
          <hr></hr>
          <p>{t('Long Of Day')}</p>
          <hr></hr>
          <p>{t('Hours of Month')}</p>
        </th>
        {arrDays}
        <th key={id + 'lunchtime'} className="schedule-tables__th">
          {t('Lunch')}
        </th>
        <th key={id + 'other'} className="schedule-tables__th">
          <p>
            {t('Total')}{' '}
            {Math.round(
              (amountOfWorkingHours + sumBeforeHolidays(month.beforeHolidays)) /
                parseFloat(typeOfWeek),
            )}{' '}
            {t('Days')}
          </p>
        </th>
      </tr>
    );
  }

  function BodyOfTableTemplate(classes, selectable, arrayOfEmployees) {
    const arrOfEmployees = [];

    arrayOfEmployees.forEach((employee, index) => {
      const {
        id: idEmployee,
        fullname,
        positionOfEmployee,
        daysOfEmployee,
      } = employee;

      const days = daysOfEmployee.map((item) => {
        return (
          <AddDay
            key={item.id}
            idSchedule={idSchedule}
            idEmployee={idEmployee}
            fulltime={positionOfEmployee.fulltime}
            num={item.number}
            id={item.id}
            weekday={item.weekday}
            weekend={item.weekend}
            holiday={item.holiday}
            beforeHoliday={item.beforeHoliday}
            kind={item.kind}
            firstStartWork={item.firstStartWork}
            firstStopWork={item.firstStopWork}
            secondStartWork={item.secondStartWork}
            secondStopWork={item.secondStopWork}
            selectable={selectable}
          />
        );
      });

      // const sumDays = (arrayOfDays) => {
      //   let sum = 0;
      //   arrayOfDays.map((day) => {
      //     if (day.weekday) {
      //       sum++;
      //     }
      //     return null;
      //   });
      //   return sum;
      // };

      arrOfEmployees.push(
        <tr className="schedule__table-tbody" key={id + index}>
          <th className={`schedule-tables__th ${classes[0]}`} key={id}>
            <button
              aria-label={`schedule_page_button_delete_employee_${employee.fullname}`}
              className={classes[1]}
              onClick={(e) => {
                e.preventDefault();
                updateSchedule({
                  variables: {
                    idSchedule: id,
                    idEmployee,
                  },
                });
                refetch();
              }}
            >
              {index + 1}
            </button>
          </th>
          <th
            className={`schedule-tables__th ${classes[0]}`}
            key={id + 'fullname'}
          >
            <button
              aria-label={`scheule_employee_edit_button_${employee.id}`}
              className={`${classes[1]} ${classes[2]}`}
              onClick={(e) => {
                e.preventDefault();
                setEmployeeForUpdate(employee);
                setShowModalEditOfEmployee(true);
              }}
            >
              {fullname}
            </button>
          </th>
          <th key={id + 'position'} className="schedule-tables__th">
            <p>{positionOfEmployee.namePosition}</p>
            <p>{employee.rateOfWork}</p>
            <p>{positionOfEmployee.longOfDay}</p>
            <p>{employee.hoursOfMonth}</p>
          </th>
          {days}
          <th key={id + 'lunchtime'} className="schedule-tables__th">
            <p>
              {hoursToString(
                timeStringToNumber(positionOfEmployee.lunch.startLunch),
              )}{' '}
              -{' '}
              {hoursToString(
                timeStringToNumber(positionOfEmployee.lunch.endLunch),
              )}
            </p>

            {positionOfEmployee.secondLunch.startSecondLunch === '0' &&
            positionOfEmployee.secondLunch.endSecondLunch === '0' ? null : (
              <p>
                {hoursToString(
                  timeStringToNumber(
                    positionOfEmployee.secondLunch.startSecondLunch,
                  ),
                )}{' '}
                -{' '}
                {hoursToString(
                  timeStringToNumber(
                    positionOfEmployee.secondLunch.endSecondLunch,
                  ),
                )}
              </p>
            )}
          </th>
          <th
            key={id + 'other'}
            className={`${
              calculationTotalData({
                hoursOfMonth: employee.hoursOfMonth,
                rateOfWork: parseFloat(employee.rateOfWork),
                daysOfEmployee,
                employee,
                fulltime: positionOfEmployee.fulltime,
              }).check
                ? 'schedule__ok'
                : 'schedule__error'
            }`}
          >
            <p>
              {t('plan')}-
              {
                calculationTotalData({
                  hoursOfMonth: employee.hoursOfMonth,
                  rateOfWork: parseFloat(employee.rateOfWork),
                  daysOfEmployee,
                  employee,
                  fulltime: positionOfEmployee.fulltime,
                }).plan
              }
              <br></br>
              {t('work')}-
              {
                calculationTotalData({
                  hoursOfMonth: employee.hoursOfMonth,
                  rateOfWork: parseFloat(employee.rateOfWork),
                  daysOfEmployee,
                  employee,
                  fulltime: positionOfEmployee.fulltime,
                }).workingHours
              }
              <br></br>
              {t('must')}-
              {
                calculationTotalData({
                  hoursOfMonth: employee.hoursOfMonth,
                  rateOfWork: parseFloat(employee.rateOfWork),
                  daysOfEmployee,
                  employee,
                  fulltime: positionOfEmployee.fulltime,
                }).mustBe
              }
              <br></br>
              {t('nt')}-
              {calculateWorkingTime(daysOfEmployee, employee).nightTime.toFixed(
                1,
              )}
              <br></br>
              {t('holi')}-
              {calculateWorkingTime(
                daysOfEmployee,
                employee,
              ).holidayHours.toFixed(1)}
            </p>
            <br></br>
            {calcTypeOfDays(
              calculateWorkingTime(daysOfEmployee, employee).types,
            )}
            <br />
            {calculateWorkingTime(daysOfEmployee, employee).name === '' &&
            calculateWorkingTime(daysOfEmployee, employee).nameHours ===
              0 ? null : (
              <p>
                {t(calculateWorkingTime(daysOfEmployee, employee).name)}-
                {calculateWorkingTime(
                  daysOfEmployee,
                  employee,
                ).nameHours.toFixed(1)}
              </p>
            )}
          </th>
        </tr>,
      );
    });
    return arrOfEmployees;
  }

  const [
    updateSchedule,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(DELETE_EMPLOYEE);
  const {loading, error, data, refetch} = useQuery(GET_SCHEDULE, {
    variables: {id},
  });

  useEffect(() => {
    if (addEmployee.addedEmployee.length !== 0) {
      refetch();
    }

    refetch();
  }, [
    addEmployee.addedEmployee,
    showModalEditOfEmployee,
    somethingChange,
    refetch,
  ]);

  if (loading || mutationLoading) return Loader();

  if (error) {
    return <Redirect to="/query-error" />;
  }

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  if (data && data.schedule) {
    const {
      nameSchedule,
      year,
      theader,
      id: idSchedule,
      month,
      amountOfWorkingHours,
      typeOfWeek,
      employees,
    } = data.schedule;

    if (toSchedules) {
      return <Redirect to="/schedules" />;
    }

    const forDaysClasses = [
      'schedule-tables__fullname',
      'schedule-tables__button',
    ];

    const forDeleteClasses = [
      'schedule-tables__button--th',
      'schedule-tables__button--del',
      'schedule-tables__employee--edit',
    ];

    return (
      <div className="schedule__table-container ">
        <div className="login-form-loader-container__loader">
          {showLoader ? Loader() : null}
        </div>
        <h1 className="schedule__table-title">{nameSchedule}</h1>
        <h2>
          {theader} {t(month.nameOfMonth)} {year}
        </h2>
        <div className="container__schedule-tables">
          <div className="schedule-tables__detele-employee">
            <table className="schedule__table">
              <thead>
                {FirstTabelRow(month, amountOfWorkingHours, typeOfWeek)}
              </thead>
              <tbody>
                {BodyOfTableTemplate(forDeleteClasses, false, employees)}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
          <div className="schedule-tables__main-table">
            <SelectableGroup
              className="main schedule__selectable-group"
              clickClassName="tick"
              enableDeselect
              onSelectionFinish={handleSelectionFinish}
              allowClickWithoutSelected={true}
              ignoreList={['.not-selectable']}
            >
              <table className="schedule__table">
                <thead>
                  {FirstTabelRow(month, amountOfWorkingHours, typeOfWeek)}
                </thead>
                <tbody>
                  {showModalEditOfEmployee
                    ? BodyOfTableTemplate(forDeleteClasses, false, employees)
                    : BodyOfTableTemplate(forDaysClasses, true, employees)}
                </tbody>
                <tfoot></tfoot>
              </table>

              <div className="schedule__menu-buttons">
                <SelectAll className="selectable-button">
                  <button
                    aria-label="schedule_page_button_select_all"
                    type="button"
                    className="button schedule__button"
                  >
                    {t('Select all')}
                  </button>
                </SelectAll>
                <DeselectAll className="selectable-button">
                  <button
                    aria-label="schedule_page_button_clear_selection"
                    type="button"
                    className="button schedule__button"
                    ref={buttonRef}
                  >
                    {t('Clear selection')}
                  </button>
                </DeselectAll>
                <br />
              </div>
            </SelectableGroup>
          </div>
        </div>
        <div className="schedule__menu menu">
          <ModalWindowAddEmployee />
          <ModalWindow />
          <ModalWindowDel name={nameSchedule} />
          <ModalWindowEmployee employee={employeeForUpdate} />

          <form
            className="menu__item"
            onSubmit={async (e) => {
              let currentLanguage = req ? req.language : i18n.language;
              setShowLoader(true);
              const stateForLoader = await fetchOdtDoc(
                e,
                idSchedule,
                adminEmail,
                currentLanguage,
              );
              setShowLoader(stateForLoader);
            }}
          >
            <button
              aria-label="schedule_page_button_download_odt_file"
              className="button"
              type="submit"
            >
              {t('Download ODT file')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <div>{Loader()}</div>;
}

const mapStateToProps = (state) => {
  return {
    addEmployee: state.employeeObj,
  };
};

Schedule.propTypes = {
  req: object,
  match: object,
  params: object,
  addEmployee: object,
  addedEmployee: array,
  length: number,
  employee: object,
  name: string,
};

export {Schedule};

export default connect(mapStateToProps)(Schedule);
