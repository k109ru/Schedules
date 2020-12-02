import React from 'react';

import {useTranslation} from 'react-i18next';

import './HomePage.scss';

function HomePage() {
  const {t} = useTranslation();

  return (
    <div className="home-page">
      <section className="">
        {/* <h2>{t('Homepage')}</h2> */}
        <h2 className="home-page__title">{t('HomepageWelcome')}</h2>
        <p className="home-page__info">{t('HomepageInfo')}</p>
        <p className="home-page__text">{t('HomepageInstruction')}</p>
        <div className="home-page__videos">
          <div className="home-page__video">
            <p className="home-page__video-lang">{t('HomepageLangEng')}</p>
            <iframe
              title="eng"
              width="460"
              height="285"
              src="https://www.youtube.com/embed/f-0qgPDChMk"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="home-page__video">
            <p className="home-page__video-lang">{t('HomepageLangRus')}</p>
            <iframe
              title="rus"
              width="460"
              height="285"
              src="https://www.youtube.com/embed/f-0qgPDChMk"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
      <div className="home-page__version">
        {/* <Trans i18nKey="welcome"> trans</Trans> */}
        <span>Version: {process.env.REACT_APP_API_VER}</span>
        <span>Build: {process.env.REACT_APP_API_BUILD}</span>
      </div>
    </div>
  );
}

export default HomePage;
