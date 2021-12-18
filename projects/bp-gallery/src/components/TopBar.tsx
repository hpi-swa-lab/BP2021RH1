import { Button, Icon } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import './TopBar.scss';

const TopBar = () => {
  const { t } = useTranslation();

  const history: History = useHistory();
  const onDefaultBrowseView = history.location.pathname.endsWith('browse');

  return (
    <div className='top-bar'>
      <div className='actions'>
        {history.location.state?.showBack && (
          <Button
            onClick={() => {
              history.go(-1);
            }}
          >
            <Icon>arrow_back</Icon>
            {t('common.back')}
          </Button>
        )}
      </div>
      <div
        className={`bh-logo ${!onDefaultBrowseView ? 'clickable' : ''}`}
        title={!onDefaultBrowseView ? t('common.back-to-home') : undefined}
        onClick={
          !onDefaultBrowseView ? () => history.push('/browse', { showBack: true }) : undefined
        }
      >
        <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
      </div>
    </div>
  );
};

export default TopBar;
