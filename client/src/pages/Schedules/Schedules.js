import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {string, number, object, array, func} from 'prop-types';

import {useQuery} from '@apollo/react-hooks';
import {GET_ALL_SCHEDULES} from '../../queries';
import {useTranslation} from 'react-i18next';
import getYearMonthDays from '../../utils/getYearMonthDays';
import Loader from '../../components/Loader';

import './Schedules.scss';
import searchIcon from '../../images/search.svg';

function Schedules({delSchedule}) {
  const {t} = useTranslation();

  const [year, setYear] = useState(getYearMonthDays().year);
  const [month, setMonth] = useState(getYearMonthDays().month);

  const [partOfScheduleName, setPartOfScheduleName] = useState('');
  const [filteredListOfSchedules, setFilteredListOfSchedules] = useState([]);

  const [showDeletedSchedule, setShowDeletedSchedule] = useState(false);
  const [showUpdatedListSchedules, setShowUpdatedListSchedules] = useState(
    false,
  );

  const initialListOfSchedules = [];
  const listElementOfSchedules = [];

  //if need notification about deleted schedule, it has some warnings
  // useEffect(() => {
  //   if (delSchedule.deletedSchedule.length !== 0) {
  //     setShowDeletedSchedule(true);
  //     setShowUpdatedListSchedules(!showUpdatedListSchedules);
  //   }
  // }, [delSchedule,]);

  if (showDeletedSchedule) {
    setTimeout(() => {
      setShowDeletedSchedule(false);
      setShowUpdatedListSchedules(!showUpdatedListSchedules);
    }, 3000);
  }

  function handleListOfSchedules(event) {
    const value = event.target.value.toLowerCase();
    const listElement = [];

    initialListOfSchedules.map((schedule, index) => {
      if (schedule.nameSchedule.toLowerCase().includes(value)) {
        listElement.push(
          <li key={schedule.id} className="schedule__item ">
            <NavLink
              to={`/schedule/${schedule.id}`}
              className="button schedule__item-button"
            >
              <p aria-label={'schedule_name_text_' + schedule.nameSchedule}>
                {index + 1}. {schedule.year} - {schedule.month.nameOfMonth} -{' '}
                {schedule.nameSchedule}
              </p>
            </NavLink>
          </li>,
        );

        return null;
      }
      return null;
    });
    setPartOfScheduleName(value);
    setFilteredListOfSchedules(listElement);
  }

  function ChooseSchedule() {
    useEffect(() => {
      refetch();
    }, []);

    return (
      <div className="schedule__fetch-list">
        <h1>
          {t('Last five schedules.')} {t('Year')} {year} - {t('Month')}{' '}
          {t(month)}
        </h1>
        <ol className="schedule__list">
          {data.schedules.forEach((schedule, index) => {
            initialListOfSchedules.push(schedule);
            listElementOfSchedules.push(
              <li key={schedule.id} className="schedule__item ">
                <NavLink
                  to={`/schedule/${schedule.id}`}
                  className="button schedule__item-button"
                >
                  <p aria-label={'schedule_name_text_' + schedule.nameSchedule}>
                    {index + 1}. {schedule.year} -{' '}
                    {t(schedule.month.nameOfMonth)} - {schedule.nameSchedule}
                  </p>
                </NavLink>
              </li>,
            );
          })}
          {partOfScheduleName.length === 0
            ? listElementOfSchedules
            : filteredListOfSchedules}
        </ol>
      </div>
    );
  }

  function DeletedSchedule() {
    const scheduleName =
      delSchedule.deletedSchedule[delSchedule.deletedSchedule.length - 1].name;

    return (
      <h1 className="schedule__notification blob">
        {t('You have deleted schedulel')} {scheduleName}
      </h1>
    );
  }

  const {loading, error, data, refetch} = useQuery(GET_ALL_SCHEDULES, {
    variables: {
      year,
      month,
    },
  });

  if (loading) return Loader();

  if (error) {
    return <Redirect to="/query-error" />;
  }

  if (data) {
    return (
      <div className="schedule-container schedule">
        <div className="table-users__func">
          <NavLink
            to="/add-schedule"
            className="button button--add"
            aria-label="main page"
            exact
          >
            {t('Add Schedule')}
          </NavLink>
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
              aria-label="form_schedule_search_input"
              className="table-users__search-field"
              type="text"
              name="filter"
              placeholder={t('Name of schedule')}
              onChange={handleListOfSchedules}
              value={partOfScheduleName}
            ></input>
            <div className="schedule__filter">
              <label htmlFor="filter-year">
                <select
                  aria-label="form_schedule_select_year"
                  className="
                    modal-form__item 
                    modal-form__item--selectable
                    schedule__filter-item
                    schedule__filter-item--year
                  "
                  onChange={(event) => {
                    setYear(parseInt(event.target.value, 10));
                  }}
                  name="filter-year"
                  value={year}
                >
                  <option value={year - 1}>{year - 1}</option>
                  <option value={year}>{year}</option>
                  <option value={year + 1}>{year + 1}</option>
                </select>
              </label>
              <label htmlFor="filter-month">
                <select
                  aria-label="form_schedule_select_month"
                  className="
                    modal-form__item 
                    modal-form__item--selectable
                    schedule__filter-item"
                  onChange={(event) => {
                    setMonth(event.target.value);
                  }}
                  name="filter-month"
                  value={month}
                >
                  <option value="January">{t('January')}</option>
                  <option value="February">{t('February')}</option>
                  <option value="March">{t('March')}</option>
                  <option value="April">{t('April')}</option>
                  <option value="May">{t('May')}</option>
                  <option value="June">{t('June')}</option>
                  <option value="July">{t('July')}</option>
                  <option value="August">{t('August')}</option>
                  <option value="September">{t('September')}</option>
                  <option value="October">{t('October')}</option>
                  <option value="November">{t('November')}</option>
                  <option value="December">{t('December')}</option>
                </select>
              </label>
            </div>
          </form>
        </div>
        {showDeletedSchedule && <DeletedSchedule />}
        <ChooseSchedule refresh={showUpdatedListSchedules} />
      </div>
    );
  }

  return Loader();
}

const mapStateToProps = (state) => {
  return {
    delSchedule: state.scheduleObj,
  };
};

Schedules.propTypes = {
  delSchedule: object,
  deletedSchedule: array,
  length: number,
  name: string,
  refresh: func,
};

export {Schedules};

export default connect(mapStateToProps)(Schedules);
