const months = require('../translate/months.js');

module.exports = function headerOfBodyDoc(year, month, lang) {
        return `<office:body>
        <office:text>
            <text:sequence-decls>
                <text:sequence-decl text:display-outline-level="0" text:name="Illustration" />
                <text:sequence-decl text:display-outline-level="0" text:name="Table" />
                <text:sequence-decl text:display-outline-level="0" text:name="Text" />
                <text:sequence-decl text:display-outline-level="0" text:name="Drawing" />
                <text:sequence-decl text:display-outline-level="0" text:name="Figure" />
            </text:sequence-decls>
            <text:p text:style-name="P4">
                <text:span text:style-name="T10">${lang === 'en' ? 'The schedule for employees ' + month + ' ' + year : 'График работы сотрудников на ' + months[month] + ' ' + year + ' года'}</text:span>
                <text:span text:style-name="T14"></text:span>
                <text:span text:style-name="T10">
                    <text:s text:c="31" />
                    ____________________________________          
                </text:span>
            </text:p>`; 
};
