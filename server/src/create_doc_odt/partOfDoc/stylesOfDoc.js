module.exports = function stylesOfDoc(month) {
  // const arrOfDays = new Array(month.daysAmount);
  // console.log(arrOfDays.length)

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

  const stylesOfTableHeader = [];
  const stylesOfTableBody = [];

  function typeOfDay(weekday, weekend, holiday, beforeHoliday) {
    const stylesOfDays = {
      weekdays: 'transparent',
      weekends: '#999999',
      holidays: '#999999',
      beforeHolidays: '#d7ded9',
    };

    if (weekday) {
      return stylesOfDays.weekdays;
    }
    if (weekend) {
      // console.log(true)
      return stylesOfDays.weekends;
    }
    if (holiday) {
      // console.log(true)
      return stylesOfDays.holidays;
    }
    if (beforeHoliday) {
      return stylesOfDays.beforeHolidays;
    }
  }

  for (let i = 1; i <= month.daysAmount; i++) {
    stylesOfTableHeader.push(`
        <style:style style:name="Таблица2.${
          alphabet[i - 1]
        }1" style:family="table-cell" style:data-style-name="N0">
            <style:table-cell-properties fo:background-color="${typeOfDay(
              month.weekdays[i - 1].isChecked,
              month.weekends[i - 1].isChecked,
              month.holidays[i - 1].isChecked,
              month.beforeHolidays[i - 1].isChecked,
            )}" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="0.05pt solid #000000" fo:border-bottom="0.05pt solid #000000">
                <style:background-image />
            </style:table-cell-properties>
        </style:style>
        `);
    stylesOfTableBody.push(`
        <style:style style:name="Таблица2.${
          alphabet[i - 1]
        }2" style:family="table-cell">
            <style:table-cell-properties fo:background-color="${typeOfDay(
              month.weekdays[i - 1].isChecked,
              month.weekends[i - 1].isChecked,
              month.holidays[i - 1].isChecked,
              month.beforeHolidays[i - 1].isChecked,
            )}" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
                <style:background-image />
            </style:table-cell-properties>
        </style:style>
        `);
  }

  // console.log(stylesOfTableHeader)
  // function createColorDay(numberOfDay, array) {

  //     // const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  //     // const alphabet = ["D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a", "b", "c", "d", "e", "f", "g", "h"];

  //     alphabet
  //     const arrrayStyles = []
  //     let temp = `
  //     <style:style style:name="Таблица2.D1" style:family="table-cell" style:data-style-name="N0">
  //         <style:table-cell-properties fo:background-color="#ffff00" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="0.05pt solid #000000" fo:border-bottom="0.05pt solid #000000">
  //             <style:background-image />
  //         </style:table-cell-properties>
  //     </style:style>
  //     `

  // }
  //d1 -1
  //d1 - 2

  return `
    <office:automatic-styles>
    <style:style style:name="Таблица2" style:family="table">
        <style:table-properties style:width="28.252cm" fo:margin-left="-0.018cm" fo:margin-right="-0.03cm" table:align="margins" />
    </style:style>
    <style:style style:name="Таблица2.A" style:family="table-column">
        <style:table-column-properties style:column-width="0.591cm" style:rel-column-width="1372*" />
    </style:style>
    <style:style style:name="Таблица2.B" style:family="table-column">
        <style:table-column-properties style:column-width="3.037cm" style:rel-column-width="7046*" />
    </style:style>
    <style:style style:name="Таблица2.C" style:family="table-column">
        <style:table-column-properties style:column-width="1.298cm" style:rel-column-width="3013*" />
    </style:style>
    <style:style style:name="Таблица2.D" style:family="table-column">
        <style:table-column-properties style:column-width="0.741cm" style:rel-column-width="1717*" />
    </style:style>
    <style:style style:name="Таблица2.E" style:family="table-column">
        <style:table-column-properties style:column-width="0.656cm" style:rel-column-width="1522*" />
    </style:style>
    <style:style style:name="Таблица2.F" style:family="table-column">
        <style:table-column-properties style:column-width="0.81cm" style:rel-column-width="1879*" />
    </style:style>
    <style:style style:name="Таблица2.G" style:family="table-column">
        <style:table-column-properties style:column-width="0.796cm" style:rel-column-width="1846*" />
    </style:style>
    <style:style style:name="Таблица2.H" style:family="table-column">
        <style:table-column-properties style:column-width="0.69cm" style:rel-column-width="1599*" />
    </style:style>
    <style:style style:name="Таблица2.I" style:family="table-column">
        <style:table-column-properties style:column-width="0.706cm" style:rel-column-width="1636*" />
    </style:style>
    <style:style style:name="Таблица2.J" style:family="table-column">
        <style:table-column-properties style:column-width="0.681cm" style:rel-column-width="1579*" />
    </style:style>
    <style:style style:name="Таблица2.K" style:family="table-column">
        <style:table-column-properties style:column-width="0.653cm" style:rel-column-width="1514*" />
    </style:style>
    <style:style style:name="Таблица2.M" style:family="table-column">
        <style:table-column-properties style:column-width="0.628cm" style:rel-column-width="1457*" />
    </style:style>
    <style:style style:name="Таблица2.N" style:family="table-column">
        <style:table-column-properties style:column-width="0.593cm" style:rel-column-width="1376*" />
    </style:style>
    <style:style style:name="Таблица2.O" style:family="table-column">
        <style:table-column-properties style:column-width="0.725cm" style:rel-column-width="1680*" />
    </style:style>
    <style:style style:name="Таблица2.P" style:family="table-column">
        <style:table-column-properties style:column-width="0.614cm" style:rel-column-width="1425*" />
    </style:style>
    <style:style style:name="Таблица2.Q" style:family="table-column">
        <style:table-column-properties style:column-width="0.718cm" style:rel-column-width="1664*" />
    </style:style>
    <style:style style:name="Таблица2.R" style:family="table-column">
        <style:table-column-properties style:column-width="0.64cm" style:rel-column-width="1486*" />
    </style:style>
    <style:style style:name="Таблица2.U" style:family="table-column">
        <style:table-column-properties style:column-width="0.707cm" style:rel-column-width="1640*" />
    </style:style>
    <style:style style:name="Таблица2.V" style:family="table-column">
        <style:table-column-properties style:column-width="0.651cm" style:rel-column-width="1510*" />
    </style:style>
    <style:style style:name="Таблица2.W" style:family="table-column">
        <style:table-column-properties style:column-width="0.649cm" style:rel-column-width="1506*" />
    </style:style>
    <style:style style:name="Таблица2.X" style:family="table-column">
        <style:table-column-properties style:column-width="0.677cm" style:rel-column-width="1571*" />
    </style:style>
    <style:style style:name="Таблица2.a" style:family="table-column">
        <style:table-column-properties style:column-width="0.624cm" style:rel-column-width="1449*" />
    </style:style>
    <style:style style:name="Таблица2.b" style:family="table-column">
        <style:table-column-properties style:column-width="0.635cm" style:rel-column-width="1474*" />
    </style:style>
    <style:style style:name="Таблица2.g" style:family="table-column">
        <style:table-column-properties style:column-width="0.714cm" style:rel-column-width="1656*" />
    </style:style>
    <style:style style:name="Таблица2.i" style:family="table-column">
        <style:table-column-properties style:column-width="1.469cm" style:rel-column-width="3409*" />
    </style:style>
    <style:style style:name="Таблица2.j" style:family="table-column">
        <style:table-column-properties style:column-width="0.968cm" style:rel-column-width="2246*" />
    </style:style>
    <style:style style:name="Таблица2.1" style:family="table-row">
        <style:table-row-properties style:min-row-height="1.111cm" />
    </style:style>
    <style:style style:name="Таблица2.A1" style:family="table-cell">
        <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="0.05pt solid #000000" fo:border-bottom="0.05pt solid #000000">
            <style:background-image />
        </style:table-cell-properties>
    </style:style>
   ${stylesOfTableHeader.join('')}
    <style:style style:name="Таблица2.i" style:family="table-cell">
    <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
        <style:background-image />
    </style:table-cell-properties>
    </style:style>
    <style:style style:name="Таблица2.j" style:family="table-cell">
    <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="0.05pt solid #000000" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
        <style:background-image />
    </style:table-cell-properties>
    </style:style>
    <style:style style:name="Таблица2.A2" style:family="table-cell">
        <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
            <style:background-image />
        </style:table-cell-properties>
    </style:style>
    <style:style style:name="Таблица2.B2" style:family="table-cell">
        <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
            <style:background-image />
        </style:table-cell-properties>
    </style:style>
    <style:style style:name="Таблица2.C2" style:family="table-cell">
        <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
            <style:background-image />
        </style:table-cell-properties>
    </style:style>
    ${stylesOfTableBody.join('')}
    <style:style style:name="Таблица2.i2" style:family="table-cell">
        <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
            <style:background-image />
        </style:table-cell-properties>
    </style:style>
    <style:style style:name="Таблица2.j2" style:family="table-cell">
        <style:table-cell-properties fo:background-color="transparent" fo:padding="0.097cm" fo:border-left="0.05pt solid #000000" fo:border-right="0.05pt solid #000000" fo:border-top="none" fo:border-bottom="0.05pt solid #000000">
            <style:background-image />
        </style:table-cell-properties>
    </style:style>
    <style:style style:name="P1" style:family="paragraph" style:parent-style-name="Standard">
        <style:paragraph-properties fo:text-align="start" style:justify-single-word="false" />
        <style:text-properties fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:paragraph-rsid="0012e75a" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P2" style:family="paragraph" style:parent-style-name="Standard">
        <style:paragraph-properties fo:text-align="end" style:justify-single-word="false" />
        <style:text-properties fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:paragraph-rsid="0012e75a" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P3" style:family="paragraph" style:parent-style-name="Standard">
        <style:paragraph-properties fo:text-align="start" style:justify-single-word="false" />
        <style:text-properties fo:font-size="11pt" fo:language="ru" fo:country="RU" style:text-underline-style="none" fo:font-weight="bold" officeooo:rsid="04a6cb48" officeooo:paragraph-rsid="0012e75a" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P4" style:family="paragraph" style:parent-style-name="Standard">
        <style:paragraph-properties fo:text-align="end" style:justify-single-word="false" />
        <style:text-properties fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:paragraph-rsid="0012e75a" style:font-weight-asian="bold" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P5" style:family="paragraph" style:parent-style-name="Standard">
        <style:paragraph-properties fo:text-align="start" style:justify-single-word="false" />
        <style:text-properties fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:paragraph-rsid="0012e75a" style:font-weight-asian="bold" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P6" style:family="paragraph" style:parent-style-name="Standard">
        <style:text-properties fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="03e8254e" officeooo:paragraph-rsid="0012e75a" style:font-weight-asian="bold" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P7" style:family="paragraph" style:parent-style-name="Standard">
        <style:text-properties officeooo:paragraph-rsid="0012e75a" />
    </style:style>
    <style:style style:name="P8" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties fo:font-size="6pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="6pt" style:font-weight-asian="bold" style:font-size-complex="6pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P9" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties fo:font-size="10.5pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="10.5pt" style:font-weight-asian="bold" style:font-size-complex="10.5pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P10" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties fo:color="#000000" fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="02184688" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P11" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="start" style:justify-single-word="false" />
        <style:text-properties fo:color="#000000" style:text-outline="false" style:text-line-through-style="none" style:text-line-through-type="none" style:font-name="Times New Roman" fo:font-size="10pt" fo:language="ru" fo:country="RU" fo:font-style="normal" fo:text-shadow="none" style:text-underline-style="none" fo:font-weight="bold" officeooo:rsid="00178ec8" officeooo:paragraph-rsid="00178ec8" fo:background-color="transparent" style:font-size-asian="10pt" style:font-style-asian="normal" style:font-weight-asian="bold" style:font-size-complex="10pt" style:font-style-complex="normal" style:font-weight-complex="bold" style:text-overline-style="none" style:text-overline-color="font-color" />
    </style:style>
    <style:style style:name="P12" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="start" style:justify-single-word="false" />
        <style:text-properties fo:color="#000000" style:text-outline="false" style:text-line-through-style="none" style:text-line-through-type="none" style:font-name="Times New Roman" fo:font-size="7pt" fo:language="ru" fo:country="RU" fo:font-style="normal" fo:text-shadow="none" style:text-underline-style="none" fo:font-weight="bold" officeooo:rsid="00178ec8" officeooo:paragraph-rsid="00178ec8" fo:background-color="transparent" style:font-size-asian="7pt" style:font-style-asian="normal" style:font-weight-asian="bold" style:font-size-complex="7pt" style:font-style-complex="normal" style:font-weight-complex="bold" style:text-overline-style="none" style:text-overline-color="font-color" />
    </style:style>
    <style:style style:name="P13" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="start" style:justify-single-word="false" />
        <style:text-properties fo:color="#000000" style:text-outline="false" style:text-line-through-style="none" style:text-line-through-type="none" style:font-name="Times New Roman" fo:font-size="6pt" fo:language="ru" fo:country="RU" fo:font-style="normal" fo:text-shadow="none" style:text-underline-style="none" fo:font-weight="bold" officeooo:rsid="00178ec8" officeooo:paragraph-rsid="00178ec8" fo:background-color="transparent" style:font-size-asian="6pt" style:font-style-asian="normal" style:font-weight-asian="bold" style:font-size-complex="6pt" style:font-style-complex="normal" style:font-weight-complex="bold" style:text-overline-style="none" style:text-overline-color="font-color" />
    </style:style>
    <style:style style:name="P14" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="start" style:justify-single-word="false" />
        <style:text-properties fo:color="#000000" style:text-outline="false" style:text-line-through-style="none" style:text-line-through-type="none" style:font-name="Arial" fo:font-size="10.5pt" fo:language="ru" fo:country="RU" fo:font-style="normal" fo:text-shadow="none" style:text-underline-style="none" fo:font-weight="bold" officeooo:rsid="00178ec8" officeooo:paragraph-rsid="00178ec8" fo:background-color="transparent" style:font-size-asian="10.5pt" style:font-style-asian="normal" style:font-weight-asian="bold" style:font-size-complex="10.5pt" style:font-style-complex="normal" style:font-weight-complex="bold" style:text-overline-style="none" style:text-overline-color="font-color" />
    </style:style>
    <style:style style:name="P15" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="02184688" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P16" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties fo:font-size="11pt" fo:font-weight="bold" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P17" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties fo:font-size="11pt" fo:font-weight="bold" officeooo:rsid="003af405" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P18" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="03dfd4c4" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P19" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="02184688" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P20" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="0256805e" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P21" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="03e098c9" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P22" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="0283958c" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P23" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:font-weight="bold" officeooo:rsid="0283958c" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P24" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:font-weight="bold" officeooo:rsid="03a426c1" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P25" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:font-weight="bold" officeooo:rsid="036a96c9" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P26" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:paragraph-properties fo:text-align="center" style:justify-single-word="false" />
        <style:text-properties style:font-name="Times New Roman1" fo:font-size="11pt" fo:font-weight="bold" officeooo:rsid="03ca3473" officeooo:paragraph-rsid="0012e75a" fo:background-color="transparent" style:font-size-asian="11pt" style:font-weight-asian="bold" style:font-size-complex="11pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="P27" style:family="paragraph" style:parent-style-name="Table_20_Contents">
        <style:text-properties fo:font-size="7pt" fo:language="ru" fo:country="RU" fo:font-weight="bold" officeooo:rsid="00178ec8" officeooo:paragraph-rsid="00178ec8" fo:background-color="transparent" style:font-size-asian="7pt" style:font-weight-asian="bold" style:font-size-complex="7pt" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="T1" style:family="text">
        <style:text-properties fo:language="ru" fo:country="RU" fo:font-weight="bold" style:font-weight-asian="bold" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="T2" style:family="text">
        <style:text-properties fo:language="ru" fo:country="RU" style:text-underline-style="none" fo:font-weight="bold" style:font-weight-asian="bold" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="T3" style:family="text">
        <style:text-properties fo:language="ru" fo:country="RU" style:text-underline-style="none" fo:font-weight="bold" officeooo:rsid="04a13aa3" style:font-weight-asian="bold" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="T4" style:family="text">
        <style:text-properties fo:language="ru" fo:country="RU" style:text-underline-style="none" fo:font-weight="bold" officeooo:rsid="04e30145" style:font-weight-asian="bold" style:font-weight-complex="bold" />
    </style:style>
    <style:style style:name="T5" style:family="text">
        <style:text-properties fo:font-size="12pt" style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color" style:font-size-asian="12pt" style:font-size-complex="12pt" />
    </style:style>
    <style:style style:name="T6" style:family="text">
        <style:text-properties fo:font-size="12pt" style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color" officeooo:rsid="04a889d6" style:font-size-asian="12pt" style:font-size-complex="12pt" />
    </style:style>
    <style:style style:name="T7" style:family="text">
        <style:text-properties fo:font-size="12pt" officeooo:rsid="049e1039" style:font-size-asian="12pt" style:font-size-complex="12pt" />
    </style:style>
    <style:style style:name="T8" style:family="text">
        <style:text-properties fo:font-size="12pt" officeooo:rsid="0021d43c" style:font-size-asian="12pt" style:font-size-complex="12pt" />
    </style:style>
    <style:style style:name="T9" style:family="text">
        <style:text-properties fo:font-size="11pt" style:font-size-asian="11pt" style:font-size-complex="11pt" />
    </style:style>
    <style:style style:name="T10" style:family="text">
        <style:text-properties fo:font-size="11pt" officeooo:rsid="037a45b8" style:font-size-asian="11pt" style:font-size-complex="11pt" />
    </style:style>
    <number:number-style style:name="N0">
        <number:number number:min-integer-digits="1" />
    </number:number-style>
</office:automatic-styles>
    `;
};
