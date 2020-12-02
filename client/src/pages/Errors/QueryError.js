import React from 'react';

import {useTranslation} from 'react-i18next';

import './QueryError.scss';

function QueryError() {
  const {t} = useTranslation();

  return (
    <div className="contant">
      <div className="App-header">
        {/* <h2>{t('Homepage')}</h2> */}
        <h4>{t('Query error title')}</h4>
        <h6>{t('Error info')}</h6>
      </div>
    </div>
  );
}

export default QueryError;
