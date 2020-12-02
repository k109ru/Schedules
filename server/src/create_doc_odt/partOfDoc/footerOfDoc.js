module.exports = function footerOfDoc(owner) {
  return `
            <text:p text:style-name="P6" />
            <text:p text:style-name="P7">
                <text:span text:style-name="T1">          </text:span>
                <text:span text:style-name="T3">          </text:span>
                <text:span text:style-name="T2">
                    <text:s text:c="25" />
                </text:span>
                <text:span text:style-name="T4">          </text:span>
                <text:span text:style-name="T2">
                    <text:s text:c="68" />
                    
                </text:span>
            </text:p>
            <text:p text:style-name="P5" />
            <text:p text:style-name="P3">
                <text:span text:style-name="T8">
                    <text:s />
                    
                    <text:s text:c="49" />
                </text:span>
                <text:span text:style-name="T9">${owner}</text:span>
            </text:p>
            </office:text>
            </office:body>
        </office:document-content>
    `;
};
