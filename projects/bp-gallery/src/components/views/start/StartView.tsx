import React from 'react';
import './StartView.scss';
import { useTranslation } from 'react-i18next';
import BrowseView from '../browse/BrowseView';
import ScrollContainer from '../../common/ScrollContainer';

const StartView = () => {
  const { t } = useTranslation();
  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='main-start-view'>
          <div className='welcome-container'>
            <div className='welcome'>
              <h1>{t('startpage.welcome-title')}</h1>
              <p>{t('startpage.welcome-text')}</p>
            </div>
            <div className='logos'>
              <div className='logo'>
                <img src='/partner-logos/lkrs_goslar.png' />
              </div>
              <div className='logo square'>
                <img src='/partner-logos/Bad-Harzburger-Wappen.png' />
              </div>
              <div className='logo'>
                <img src='/partner-logos/Logo%20GZ.jpg' />
              </div>
              <div className='logo'>
                <img src='/partner-logos/logo-farbe%20-%20Kopie.jpg' />
              </div>
              <div className='logo'>
                <img src='/partner-logos/HarzKurier-gross.jpg' />
              </div>
            </div>
          </div>
          <BrowseView startpage={true} />
        </div>
      )}
    </ScrollContainer>
  );
};

export default StartView;
