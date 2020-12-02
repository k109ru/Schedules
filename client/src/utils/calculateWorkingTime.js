import {timeStringToFloat, hoursToString} from './calculateTime';

export default function calculateWorkingTime(arrayOfDays, employee) {
  let hours = {
    workingHours: 0,
    name: '',
    nameHours: 0,
    nightTime: 0,
    holidayHours: 0,
    types: {},
  };

  const typeOfDaysNames = [
    {name: 'businessTrip', value: 'BT'},
    {name: 'study', value: 'S'},
    {name: 'studyAdd', value: 'AS'},
    {name: 'unknown', value: 'UR'},
    {name: 'absenteeism', value: 'A'},
    {name: 'goverment', value: 'MA'},
    {name: 'holiday', value: 'SV'},
    {name: 'disease', value: 'D'},
    {name: 'vacation', value: 'V'},
    {name: 'childCare', value: 'CC'},
    {name: 'admVacation', value: 'AV'},
    {name: 'overTime', value: 'O'},
    {name: 'nightTime', value: 'NT'},
  ];

  arrayOfDays.map((day) => {
    if (
      employee.positionOfEmployee.fulltime &&
      day.weekday &&
      day.kind.working
    ) {
      let floatHoursOfDay =
        timeStringToFloat(day.firstStopWork) -
        timeStringToFloat(day.firstStartWork);
      let floatHoutsOfLunch =
        timeStringToFloat(employee.positionOfEmployee.lunch.endLunch) -
        timeStringToFloat(employee.positionOfEmployee.lunch.startLunch);

      let floatHoursOfDaySecond =
        timeStringToFloat(day.secondStopWork) -
        timeStringToFloat(day.secondStartWork);
      let floatHoutsOfLunchSecond =
        timeStringToFloat(
          employee.positionOfEmployee.secondLunch.endSecondLunch,
        ) -
        timeStringToFloat(
          employee.positionOfEmployee.secondLunch.startSecondLunch,
        );

      hours.workingHours =
        hours.workingHours +
        floatHoursOfDay +
        floatHoursOfDaySecond -
        floatHoutsOfLunch -
        floatHoutsOfLunchSecond;

      if (
        day.beforeHoliday &&
        timeStringToFloat(day.firstStartWork) !==
          timeStringToFloat(day.firstStopWork)
      ) {
        hours.workingHours = hours.workingHours - 1;
      }
    }

    // it needs to correct for non-fulltime   !!!!!WORKING MAY BE NEED CHECK
    if (
      !employee.positionOfEmployee.fulltime &&
      day.kind.working &&
      timeStringToFloat(day.firstStartWork) -
        timeStringToFloat(day.firstStopWork) !==
        0
    ) {
      let floatHoursOfDay =
        timeStringToFloat(day.firstStopWork) -
        timeStringToFloat(day.firstStartWork);
      let floatHoutsOfLunch =
        timeStringToFloat(employee.positionOfEmployee.lunch.endLunch) -
        timeStringToFloat(employee.positionOfEmployee.lunch.startLunch);

      let floatHoursOfDaySecond =
        timeStringToFloat(day.secondStopWork) -
        timeStringToFloat(day.secondStartWork);
      let floatHoutsOfLunchSecond =
        timeStringToFloat(
          employee.positionOfEmployee.secondLunch.endSecondLunch,
        ) -
        timeStringToFloat(
          employee.positionOfEmployee.secondLunch.startSecondLunch,
        );

      hours.workingHours =
        hours.workingHours +
        floatHoursOfDay +
        floatHoursOfDaySecond -
        floatHoutsOfLunch -
        floatHoutsOfLunchSecond;

      if (day.holiday) {
        let floatHoursOfDayH =
          timeStringToFloat(day.firstStopWork) -
          timeStringToFloat(day.firstStartWork);
        let floatHoutsOfLunchH =
          timeStringToFloat(employee.positionOfEmployee.lunch.endLunch) -
          timeStringToFloat(employee.positionOfEmployee.lunch.startLunch);

        let floatHoursOfDaySecondH =
          timeStringToFloat(day.secondStopWork) -
          timeStringToFloat(day.secondStartWork);
        let floatHoutsOfLunchSecondH =
          timeStringToFloat(
            employee.positionOfEmployee.secondLunch.endSecondLunch,
          ) -
          timeStringToFloat(
            employee.positionOfEmployee.secondLunch.startSecondLunch,
          );

        hours.holidayHours =
          hours.holidayHours +
          floatHoursOfDayH +
          floatHoursOfDaySecondH -
          floatHoutsOfLunchH -
          floatHoutsOfLunchSecondH;
      }

      if (
        timeStringToFloat(day.firstStartWork) >= 22 &&
        timeStringToFloat(day.firstStopWork) < 22
      ) {
        hours.nightTime =
          hours.nightTime + (timeStringToFloat(day.firstStartWork) - 22);
      }

      if (
        timeStringToFloat(day.firstStopWork) > 22 &&
        timeStringToFloat(day.firstStartWork) < 22
      ) {
        hours.nightTime =
          hours.nightTime + (timeStringToFloat(day.firstStopWork) - 22);
      }

      //22-24 start and end
      if (
        timeStringToFloat(day.firstStartWork) >= 22 &&
        timeStringToFloat(day.firstStopWork) > 22
      ) {
        hours.nightTime =
          hours.nightTime +
          (timeStringToFloat(day.firstStopWork) -
            timeStringToFloat(day.firstStartWork));
      }

      if (
        timeStringToFloat(day.firstStartWork) >= 0 &&
        timeStringToFloat(day.firstStartWork) < 6 &&
        timeStringToFloat(day.firstStopWork) > 6
      ) {
        hours.nightTime =
          hours.nightTime + (6 - timeStringToFloat(day.firstStartWork));
      }

      if (
        timeStringToFloat(day.firstStopWork) < 6 &&
        timeStringToFloat(day.firstStartWork) === 0
      ) {
        hours.nightTime =
          hours.nightTime +
          (timeStringToFloat(day.firstStopWork) -
            timeStringToFloat(day.firstStartWork));
      }

      //0-6 start and end
      if (
        timeStringToFloat(day.firstStopWork) < 6 &&
        timeStringToFloat(day.firstStartWork) > 0 &&
        timeStringToFloat(day.firstStopWork) <= 6 &&
        timeStringToFloat(day.firstStartWork) < 6
      ) {
        hours.nightTime =
          hours.nightTime +
          (timeStringToFloat(day.firstStopWork) -
            timeStringToFloat(day.firstStartWork));
      }
    }

    typeOfDaysNames.map((item) => {
      if (day.kind[item.name]) {
        hours.name = 'all';

        let beforeHolidaySum = 0;
        hours.nameHours =
          hours.nameHours +
          timeStringToFloat(
            hoursToString(employee.positionOfEmployee.longOfDay),
          );

        if (day.beforeHoliday) {
          hours.nameHours = hours.nameHours - 1;
          beforeHolidaySum++;
        }

        if (typeof hours.types[item.value] === 'undefined') {
          hours.types[item.value] = {
            name: item.value,
            value:
              timeStringToFloat(
                hoursToString(employee.positionOfEmployee.longOfDay),
              ) - beforeHolidaySum,
          };
        } else {
          hours.types[item.value].value =
            hours.types[item.value].value +
            timeStringToFloat(
              hoursToString(employee.positionOfEmployee.longOfDay),
            ) -
            beforeHolidaySum;
        }
      }

      return null;
    });
    return null;
  });
  return hours;
}
