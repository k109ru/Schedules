const fs = require('fs');
const path = require('path');
const cmd = require('node-cmd');

const headerOfDoc = require('./partOfDoc/headerOfDoc');
const stylesOfDoc = require('./partOfDoc/stylesOfDoc');
const headerOfBodyDoc = require('./partOfDoc/headerOfBodyDoc');
const headerOfTable = require('./partOfDoc/headerOfTable');
const bodyOfTable = require('./partOfDoc/bodyOfTable');
const footerOfDoc = require('./partOfDoc/footerOfDoc');

export default function createDoc(schedule, owner, lang) {
  //third params lang , if need.
  //lang needs to trim (only first two) simbols chrome ru but firefox ru-RU
  // console.log(owner, lang);
  let language = lang.slice(0,2);

  let compliteDoc =
    headerOfDoc(language) +
    stylesOfDoc(schedule.month) +
    headerOfBodyDoc(schedule.year, schedule.month.nameOfMonth, language) +
    headerOfTable(schedule.month.daysAmount, language) +
    bodyOfTable(
      schedule.employees,
      schedule.month.daysAmount,
      schedule.amountOfWorkingHours
    ) +
    footerOfDoc(owner);

  fs.writeFileSync(
    path.resolve(__dirname) + '/Template/content.xml',
    compliteDoc,
    (err) => {
      if (err) throw err;
    },
  );

  //Create our schedule.odt file.
  cmd.run(
    `cd ${path.resolve(__dirname) + '/Template'} && zip -r - . | dd of=${
      path.resolve(__dirname) + `/outputFile/schedule_${owner}.odt`
    }`,
  );

  // return doc
}
