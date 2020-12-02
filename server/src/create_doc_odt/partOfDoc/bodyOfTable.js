module.exports = function bodyOfTable(employees, daysAmount, hours) {
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

  // const listOfDays = [];
  const lastThreeDaysRow = [];

  if (daysAmount === 31) {
    lastThreeDaysRow.push(`
        <table:table-cell table:style-name="Таблица2.f2" office:value-type="string">
        <text:p text:style-name="P24">29d-r</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.g2" office:value-type="string">
            <text:p text:style-name="P24">Emp</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.h2" office:value-type="string">
            <text:p text:style-name="P24">emp</text:p>
        </table:table-cell>
        `);
  }

  if (daysAmount === 30) {
    lastThreeDaysRow.push(`
        <table:table-cell table:style-name="Таблица2.f2" office:value-type="string">
        <text:p text:style-name="P24">29d-r</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.g2" office:value-type="string">
            <text:p text:style-name="P24">Emp</text:p>
        </table:table-cell>
        `);
  }

  if (daysAmount === 29) {
    lastThreeDaysRow.push(`
        <table:table-cell table:style-name="Таблица2.f2" office:value-type="string">
        <text:p text:style-name="P24">29d-r</text:p>
        </table:table-cell>
        `);
  }

  // ${lastThreeDaysRow.join('')}

  const alphabet = [
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
  ];
  const tableRows = [];

  employees.map((employee, index) => {
    const listOfDays = [];
    let workingDays = 0;

    for (let i = 1; i <= daysAmount; i++) {
      let firstTime = '';
      // let secondTime = '';

      if (
        employee.daysOfEmployee[i - 1].firstStartWork !== '0' &&
        employee.daysOfEmployee[i - 1].firstStopWork !== '0' &&
        employee.daysOfEmployee[i - 1].kind.working === true
      ) {
        firstTime = `${employee.daysOfEmployee[i - 1].firstStartWork}/${
          employee.daysOfEmployee[i - 1].firstStopWork
        }`;
      }

      if (!employee.daysOfEmployee[i - 1].kind.working) {
        let obj = employee.daysOfEmployee[i - 1].kind;

        for (let prop in obj) {
          if (obj[prop]) {
            typeOfDaysNames.map((item) => {
              if (item.name === prop) {
                firstTime = item.value;
              }
            });
          }
        }
      }

      listOfDays.push(`
            <table:table-cell table:style-name="Таблица2.${
              alphabet[i - 1]
            }2" office:value-type="string">
                <text:p text:style-name="P24">${firstTime}</text:p>
            </table:table-cell>
            `);
    }

    employee.daysOfEmployee.map((day) => {
      if (day.weekday) {
        workingDays = ++workingDays;
      }
    });

    tableRows.push(`
        <table:table-row>
            <table:table-cell table:style-name="Таблица2.A2" office:value-type="string">
                <text:p text:style-name="P23">${index + 1}</text:p>
            </table:table-cell>
            <table:table-cell table:style-name="Таблица2.B2" office:value-type="string">
                <text:p text:style-name="P26">${employee.fullname}</text:p>
            </table:table-cell>
            <table:table-cell table:style-name="Таблица2.C2" office:value-type="string">
                <text:p text:style-name="P24">${
                  employee.positionOfEmployee.namePosition
                }</text:p>
            </table:table-cell>
            ${listOfDays.join('')}
            <table:table-cell table:style-name="Таблица2.i2" office:value-type="string">
                <text:p text:style-name="P27">${hours} - ${workingDays}</text:p>
                <text:p text:style-name="P27">${employee.hoursOfMonth} - ${workingDays}</text:p>
            </table:table-cell>
            <table:table-cell table:style-name="Таблица2.j2" office:value-type="string">
                <text:p text:style-name="P27">${
                  employee.positionOfEmployee.lunch.startLunch +
                  '-' +
                  employee.positionOfEmployee.lunch.endLunch
                }</text:p>
            </table:table-cell>
        </table:table-row>
        `);
  });

  return `
        ${tableRows.join('')}
    </table:table>
    `;
};
