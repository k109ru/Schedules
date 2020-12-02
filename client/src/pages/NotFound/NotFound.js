import React from 'react';
import {useTranslation} from 'react-i18next';

import './NotFound.scss';

function NotFound() {
  const {t} = useTranslation();

  return (
    <div className="contant">
      {/* <div className="App-header">
        <h2>{t('Homepage')}</h2>
      </div>
      <div className="App-intro">
        <Trans i18nKey="welcome"> trans</Trans>
      </div> */}
      <h2>{t('Page not found')}</h2>
    </div>
  );
}

export default NotFound;
