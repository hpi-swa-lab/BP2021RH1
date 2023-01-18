import { Button, Icon } from '@mui/material';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { History, Location } from 'history';
import './TopBar.scss';
import SearchBar from '../views/search/SearchBar';
import NavigationBar from './NavigationBar';

const TopBar = ({ isMobile }: { isMobile?: boolean }) => {
  const { t } = useTranslation();

  const history: History = useHistory();
  const { search }: Location = useLocation();

  return (
    <div className='top-bar'>
      <div className='action-wrapper'>
        {history.location.state?.showBack ? (
          <div className='actions'>
            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              <Icon>arrow_back</Icon>
              {t('common.back')}
            </Button>
          </div>
        ) : (
          <div
            className={'bh-logo clickable'}
            title={t('common.back-to-home')}
            onClick={() => history.push('/start', { showBack: false })}
          >
            <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
          </div>
        )}
      </div>
      <div className='search-div'>
        <SearchBar
          searchParams={new URLSearchParams(search)}
          isAllSearchActive={true}
          isTopBarSearch={true}
        />
      </div>
      <div className='divider' />
      {!isMobile && <NavigationBar />}
    </div>
  );
};

export default TopBar;
