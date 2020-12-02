import React from 'react';
import {string, bool, number, any, object} from 'prop-types';

import {createSelectable} from 'react-selectable-fast';
import {useTranslation} from 'react-i18next';

import {timeStringToNumber, hoursToString} from '../../utils/calculateTime';

function AddDay(props) {
  const {t} = useTranslation();

  const {selectableRef, isSelected, isSelecting} = props;

  if (props.notselect) {
    return (
      <th
        className={`schedule-tables__th item not-selectable schedule__table-th--${
          props.day.isChecked ? 'weekday' : 'weekend'
        }`}
        ref={selectableRef}
      >
        <div aria-label={'day_' + props.num}>{props.num}</div>
      </th>
    );
  }

  function typeOfDay() {
    if (props.kind.businessTrip) {
      return t('BT');
    }
    if (props.kind.study) {
      return t('S');
    }
    if (props.kind.studyAdd) {
      return t('AS');
    }
    if (props.kind.unknown) {
      return t('UR');
    }
    if (props.kind.absenteeism) {
      return t('A');
    }
    if (props.kind.goverment) {
      return t('MA');
    }
    if (props.kind.holidayKind) {
      return t('SV');
    }
    if (props.kind.disease) {
      return t('D');
    }
    if (props.kind.vacation) {
      return t('V');
    }
    if (props.kind.childCare) {
      return t('CC');
    }
    if (props.kind.admVacation) {
      return t('AV');
    }
    if (props.kind.overTime) {
      return t('O');
    }
    if (props.kind.hightTime) {
      return t('NT');
    }
  }

  function Working() {
    if (props.weekday && props.fulltime && typeOfDay() === undefined) {
      return (
        <div>
          {(props.firstStartWork === '0' && props.firstStopWork === '0') ||
          props.firstStartWork === '' ||
          props.firstStopWork === '' ? null : (
            <p>
              {hoursToString(timeStringToNumber(props.firstStartWork))}/{' '}
              {hoursToString(
                timeStringToNumber(props.firstStopWork) -
                  (props.beforeHoliday ? 1 : 0),
              )}
            </p>
          )}
          {(props.secondStartWork === '0' && props.secondStopWork === '0') ||
          props.secondStartWork === '' ||
          props.secondStopWork === '' ? null : (
            <p>
              {hoursToString(timeStringToNumber(props.secondStartWork))}/{' '}
              {hoursToString(timeStringToNumber(props.secondStopWork))}
            </p>
          )}
        </div>
      );
    }

    if (!props.fulltime && typeOfDay() === undefined) {
      return (
        <div>
          {(props.firstStartWork === '0' && props.firstStopWork === '0') ||
          props.firstStartWork === '' ||
          props.firstStopWork === '' ? null : (
            <p>
              {hoursToString(timeStringToNumber(props.firstStartWork))}/{' '}
              {hoursToString(timeStringToNumber(props.firstStopWork))}
            </p>
          )}
          {(props.secondStartWork === '0' && props.secondStopWork === '0') ||
          props.secondStartWork === '' ||
          props.secondStopWork === '' ? null : (
            <p>
              {hoursToString(timeStringToNumber(props.secondStartWork))}/{' '}
              {hoursToString(timeStringToNumber(props.secondStopWork))}
            </p>
          )}
        </div>
      );
    }
    let workTime = ``;

    return workTime;
  }

  function selectClassName() {
    if (props.beforeHoliday) {
      return 'schedule__table-td--before-holiday';
    }

    if (props.weekday) {
      return 'schedule__table-td--weekday';
    }

    if (!props.fulltime) {
      return 'schedule__table-td--allday';
    }

    if (props.weekend || props.holiday) {
      return 'not-selectable schedule__table-td--weekend';
    }
  }

  if (props.selectable) {
    return (
      <td
        aria-label={'schedule_day_' + props.num + '_' + props.idEmployee}
        className={`
            item schedule__table-td
            schedule-tables__enable-pointer 
            ${selectClassName()} 
            ${isSelected ? 'schedule__table-td--selected' : ''} 
            ${isSelecting ? 'schedule__table-td--selecting' : ''}
           
          `}
        ref={selectableRef}
      >
        {typeOfDay()}
        {Working()}
      </td>
    );
  }

  return (
    <td
      className={`
            item schedule__table-td
            ${selectClassName()}
            not-selectable 
          `}
      ref={selectableRef}
    >
      {typeOfDay()}
      {Working()}
    </td>
  );
}

AddDay.propTypes = {
  idEmployee: string,
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

export default createSelectable(AddDay);
