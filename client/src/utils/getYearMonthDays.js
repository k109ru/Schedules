import uuidv4 from 'uuid/v4';

function getYearMonthDays() {
  const obj = {
    year: null,
    month: null,
    days: null,
    monthNum: null,
    weekdays: [],
    weekends: [],
    holidays: [],
    forTypeOfDays: [],
  };

  var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const now = new Date();
  const nowMonth = now.getMonth();

  obj.year = now.getFullYear();

  if (nowMonth === 11) {
    // now.setFullYear(obj.year + 1);
    obj.year++;
    obj.monthNum = 0;
  } else {
    obj.monthNum = nowMonth + 1;
  }

  obj.month = monthNames[obj.monthNum];

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  obj.days = daysInMonth(obj.monthNum + 1, obj.year);

  for (let i = 0; i < obj.days; i++) {
    const numWeekday = new Date(obj.year, obj.monthNum, i + 1).getDay();

    obj.forTypeOfDays.push(i + 1);

    if (numWeekday === 0 || numWeekday === 6) {
      obj.weekends.push({
        num: i + 1,
        id: uuidv4(),
        isChecked: true,
      });
    } else {
      obj.weekends.push({
        num: i + 1,
        id: uuidv4(),
        isChecked: false,
      });
    }
  }

  obj.weekends.forEach((item) => {
    let check = item.isChecked;
    obj.weekdays.push({...item, isChecked: !check});
  });

  obj.weekends.forEach((item) => {
    obj.holidays.push({...item, isChecked: false});
  });
  return obj;
}

export default getYearMonthDays;
