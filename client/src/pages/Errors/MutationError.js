import React from 'react';
import {useTranslation} from 'react-i18next';

import './MutationError.scss';

function MutationError() {
  const {t} = useTranslation();

  return (
    <div className="contant">
      <div className="App-header">
        <h4>{t('Mutation error title')}</h4>
        <h6>{t('Error info')}</h6>
      </div>
    </div>
  );
}

export default MutationError;
