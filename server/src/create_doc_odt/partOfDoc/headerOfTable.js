module.exports = function headerOfTable(daysAmount, lang) {
  const lastThreeDaysColumn = [];
  const lastThreeDaysRow = [];

  if (daysAmount === 31) {
    lastThreeDaysRow.push(`
        <table:table-cell table:style-name="Таблица2.f1" office:value-type="string">
            <text:p text:style-name="P16">29</text:p>
            <text:p text:style-name="P25" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.g1" office:value-type="string">
            <text:p text:style-name="P16">30</text:p>
            <text:p text:style-name="P26" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.h1" office:value-type="float" office:value="31">
            <text:p text:style-name="P16">31</text:p>
        </table:table-cell>
        `);

    lastThreeDaysColumn.push(`
        <table:table-column table:style-name="Таблица2.V" />
        <table:table-column table:style-name="Таблица2.g" />
        <table:table-column table:style-name="Таблица2.J" />
        `);
  }

  if (daysAmount === 30) {
    lastThreeDaysRow.push(`
        <table:table-cell table:style-name="Таблица2.f1" office:value-type="string">
            <text:p text:style-name="P16">29</text:p>
            <text:p text:style-name="P25" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.g1" office:value-type="string">
            <text:p text:style-name="P16">30</text:p>
            <text:p text:style-name="P26" />
        </table:table-cell>
        `);

    lastThreeDaysColumn.push(`
        <table:table-column table:style-name="Таблица2.V" />
        <table:table-column table:style-name="Таблица2.g" />
        `);
  }

  if (daysAmount === 29) {
    lastThreeDaysRow.push(`
        <table:table-cell table:style-name="Таблица2.f1" office:value-type="string">
            <text:p text:style-name="P16">29</text:p>
            <text:p text:style-name="P25" />
        </table:table-cell>
        `);

    lastThreeDaysColumn.push(`
        <table:table-column table:style-name="Таблица2.V" />
        `);
  }

  // ${lastThreeDaysColumn.join('')}
  // ${lastThreeDaysRow.join('')}

  return `
    <table:table table:name="Таблица2" table:style-name="Таблица2">
    <table:table-column table:style-name="Таблица2.A" />
    <table:table-column table:style-name="Таблица2.B" />
    <table:table-column table:style-name="Таблица2.C" />
    <table:table-column table:style-name="Таблица2.D" />
    <table:table-column table:style-name="Таблица2.E" />
    <table:table-column table:style-name="Таблица2.F" />
    <table:table-column table:style-name="Таблица2.G" />
    <table:table-column table:style-name="Таблица2.H" />
    <table:table-column table:style-name="Таблица2.I" />
    <table:table-column table:style-name="Таблица2.J" />
    <table:table-column table:style-name="Таблица2.K" />
    <table:table-column table:style-name="Таблица2.J" />
    <table:table-column table:style-name="Таблица2.M" />
    <table:table-column table:style-name="Таблица2.N" />
    <table:table-column table:style-name="Таблица2.O" />
    <table:table-column table:style-name="Таблица2.P" />
    <table:table-column table:style-name="Таблица2.Q" />
    <table:table-column table:style-name="Таблица2.R" />
    <table:table-column table:style-name="Таблица2.K" table:number-columns-repeated="2" />
    <table:table-column table:style-name="Таблица2.U" />
    <table:table-column table:style-name="Таблица2.V" />
    <table:table-column table:style-name="Таблица2.W" />
    <table:table-column table:style-name="Таблица2.X" />
    <table:table-column table:style-name="Таблица2.K" />
    <table:table-column table:style-name="Таблица2.J" />
    <table:table-column table:style-name="Таблица2.a" />
    <table:table-column table:style-name="Таблица2.b" />
    <table:table-column table:style-name="Таблица2.K" />
    <table:table-column table:style-name="Таблица2.b" />
    <table:table-column table:style-name="Таблица2.R" />
    ${lastThreeDaysColumn.join('')}
    <table:table-column table:style-name="Таблица2.i" />
    <table:table-column table:style-name="Таблица2.j" />
    <table:table-row table:style-name="Таблица2.1">
        <table:table-cell table:style-name="Таблица2.A1" office:value-type="string">
            <text:p text:style-name="P8" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.A1" office:value-type="string">
            <text:p text:style-name="P9">${lang === 'en' ? 'Fullname' : 'Ф.И.О.'}</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.A1" office:value-type="string">
            <text:p text:style-name="P9">${lang === 'en' ? 'Position' : 'Должность'}</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.D1" office:value-type="float" office:value="1">
            <text:p text:style-name="P10">1</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.E1" office:value-type="float" office:value="2">
            <text:p text:style-name="P10">2</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.F1" office:value-type="string">
            <text:p text:style-name="P10">3</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.G1" office:value-type="string">
            <text:p text:style-name="P15">4</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.H1" office:value-type="float" office:value="5">
            <text:p text:style-name="P15">5</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.I1" office:value-type="string">
            <text:p text:style-name="P15">6</text:p>
            <text:p text:style-name="P18" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.J1" office:value-type="string">
            <text:p text:style-name="P19">7</text:p>
            <text:p text:style-name="P20" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.K1" office:value-type="string">
            <text:p text:style-name="P15">8</text:p>
            <text:p text:style-name="P21" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.L1" office:value-type="string">
            <text:p text:style-name="P16">9</text:p>
            <text:p text:style-name="P22" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.M1" office:value-type="float" office:value="10">
            <text:p text:style-name="P16">10</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.N1" office:value-type="string">
            <text:p text:style-name="P16">11</text:p>
            <text:p text:style-name="P18" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.O1" office:value-type="float" office:value="12">
            <text:p text:style-name="P16">12</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.P1" office:value-type="float" office:value="13">
            <text:p text:style-name="P16">13</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.Q1" office:value-type="float" office:value="14">
            <text:p text:style-name="P16">14</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.R1" office:value-type="float" office:value="15">
            <text:p text:style-name="P16">15</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.S1" office:value-type="string">
            <text:p text:style-name="P16">16</text:p>
            <text:p text:style-name="P23" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.T1" office:value-type="float" office:value="17">
            <text:p text:style-name="P17">17</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.U1" office:value-type="float" office:value="18">
            <text:p text:style-name="P17">18</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.V1" office:value-type="float" office:value="19">
            <text:p text:style-name="P16">19</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.W1" office:value-type="float" office:value="20">
            <text:p text:style-name="P16">20</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.X1" office:value-type="float" office:value="21">
            <text:p text:style-name="P16">21</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.Y1" office:value-type="string">
            <text:p text:style-name="P16">22</text:p>
            <text:p text:style-name="P24" />
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.Z1" office:value-type="float" office:value="23">
            <text:p text:style-name="P16">23</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.a1" office:value-type="string">
            <text:p text:style-name="P17">24</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.b1" office:value-type="float" office:value="25">
            <text:p text:style-name="P17">25</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.c1" office:value-type="float" office:value="26">
            <text:p text:style-name="P16">26</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.d1" office:value-type="float" office:value="27">
            <text:p text:style-name="P16">27</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.e1" office:value-type="string">
            <text:p text:style-name="P16">28</text:p>
        </table:table-cell>
        ${lastThreeDaysRow.join('')}
        <table:table-cell table:style-name="Таблица2.A1" office:value-type="string">
            <text:p text:style-name="P8">${lang === 'en' ? 'Total days/hours' : 'Кол-во дней и часов'}</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="Таблица2.j1" office:value-type="string">
            <text:p text:style-name="P8">${lang === 'en' ? 'Lunch' : 'Обеденный перерыв'}</text:p>
        </table:table-cell>
    </table:table-row>
    `;
};
