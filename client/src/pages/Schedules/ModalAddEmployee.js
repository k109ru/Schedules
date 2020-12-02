import React from 'react';
import {Redirect} from 'react-router-dom';
import uuidv4 from 'uuid/v4';

import {connect} from 'react-redux';
import {addedEmployee} from '../../actions';

import {useMutation, useQuery} from 'react-apollo';
import {
  GET_SCHEDULE_AND_ALL_USERS,
  ADD_EMPLOYEE_TO_SHEDULE,
} from '../../queries';

import Loader from '../../components/Loader';
import {useTranslation} from 'react-i18next';

import './ModalAddEmployee.scss';

const ModalAddEmployee = ({handleClose, show, id, addedEmployee}) => {
  const {t} = useTranslation();

  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  function createUserForMutation(month, user) {
    function daysForMutation(hoursOfWork, secondHoursOfWork, month) {
      const daysArr = [];

      for (let i = 0; i < month.daysAmount; i++) {
        daysArr.push(i + 0);
      }

      const arrOfDays = [];

      daysArr.map((day, index) => {
        arrOfDays.push({
          number: index + 1,
          weekday: month.weekdays[index].isChecked,
          weekend: month.weekends[index].isChecked,
          holiday: month.holidays[index].isChecked,
          beforeHoliday: month.beforeHolidays[index].isChecked,
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
        return null;
      });

      return arrOfDays;
    }

    function createEmployee(user) {
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
                startSecondWork:
                  user.position.secondHoursOfWork.startSecondWork,
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
          create: daysForMutation(
            user.position.hoursOfWork,
            user.position.secondHoursOfWork,
            month,
          ),
        },
      };
      return userToEmployee;
    }

    return createEmployee(user);
  }

  const listElementOfUsers = [];

  const [
    upsertSchedule,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(ADD_EMPLOYEE_TO_SHEDULE);

  const {loading, error, data} = useQuery(GET_SCHEDULE_AND_ALL_USERS, {
    variables: {id},
  });

  if (loading || mutationLoading) return Loader();

  if (error) {
    return <Redirect to="/query-error" />;
  }

  if (mutationError) {
    return <Redirect to="/mutation-error" />;
  }

  if (data && data.schedule && data.users) {
    const {month} = data.schedule;

    data.users.map((user, index) => {
      listElementOfUsers.push(
        <tr aria-label="schedule_modal_add_employee_row_table" key={index}>
          <th key={user.id} className="employee__th">
            {index + 1}{' '}
          </th>
          <th key={user.id + 'fullname'} className="employee__th">
            {user.fullname}
          </th>
          <th key={user.id + 'position'} className="employee__th">
            {user.position.namePosition}
          </th>
          <th key={user.id + 'rateOfWork'} className="employee__th">
            {user.rateOfWork}
          </th>
          <th key={user.id + 'longOfDay'} className="employee__th">
            {user.position.longOfDay}
          </th>
          <th key={user.id + 'fulltime'} className="employee__th">
            {user.position.fulltime ? t('Yes') : t('No')}
          </th>
          <th key={user.id + 'hoursOfWork'} className="employee__th">
            {user.position.hoursOfWork.startWork +
              ' - ' +
              user.position.hoursOfWork.endWork}
          </th>
          <th key={user.id + 'secondHoursOfWork'} className="employee__th">
            {user.position.secondHoursOfWork.startSecondWork +
              ' - ' +
              user.position.secondHoursOfWork.endSecondWork}
          </th>
          <th key={user.id + 'lunch'} className="employee__th">
            {user.position.lunch.startLunch +
              ' - ' +
              user.position.lunch.endLunch}
          </th>
          <th key={user.id + 'secondLunch'} className="employee__th">
            {user.position.secondLunch.startSecondLunch +
              ' - ' +
              user.position.secondLunch.endSecondLunch}
          </th>
          <th key={user.id + 'delete'} className="parent-button">
            <button
              aria-label="schedule_modal_add_employee_add_button"
              className="button"
              onClick={async (e) => {
                e.preventDefault();
                await upsertSchedule({
                  variables: {
                    idSchedule: id,
                    employee: createUserForMutation(month, user),
                  },
                });
                addedEmployee([{id: id, name: user.fullname}]);
              }}
            >
              {t('Add')}
            </button>
          </th>
        </tr>,
      );

      return null;
    });

    return (
      <div
        aria-label="schedule_modal_add_employee_window"
        className={showHideClassName}
      >
        <div className="modal-main  employee__table-container">
          <table
            aria-label="schedule_modal_add_employee_table"
            className="employee__table "
          >
            <thead>
              <tr>
                <th key={uuidv4()} className="employee__th">
                  {' '}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('Full Name')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('Position')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('Rate of Work')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('Long Of Day')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('Full time')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('First hours of work')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('Second hours of work')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('First Lunch')}
                </th>
                <th key={uuidv4()} className="employee__th">
                  {t('Second Lunch')}
                </th>
                <th key={uuidv4()}></th>
              </tr>
            </thead>
            <tbody>{listElementOfUsers}</tbody>
          </table>
          <button
            aria-label="schedule_modal_add_employee_close_button"
            className="button modal__button--submit employee__button-close"
            type="button"
            onClick={handleClose}
          >
            {t('Close')}
          </button>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    addEmployee: state.employeeObj,
  };
};

export {ModalAddEmployee};

export default connect(mapStateToProps, {addedEmployee})(ModalAddEmployee);
