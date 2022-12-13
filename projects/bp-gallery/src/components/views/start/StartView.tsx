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
          </div>
          <BrowseView startpage={true} />
        </div>
      )}
    </ScrollContainer>
  );
};

export default StartView;
