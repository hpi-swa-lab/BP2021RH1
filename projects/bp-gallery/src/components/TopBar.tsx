import { Button, Icon } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { BrowserHistory } from 'history';
import './TopBar.scss';

const TopBar = () => {
  const hist: BrowserHistory = useHistory();
  return (
    <div className='top-bar'>
      <div className='actions'>
        {hist.location.state?.showBack && (
          <Button
            onClick={() => {
              hist.go(-1);
            }}
          >
            <Icon>arrow_back</Icon>Zurück
          </Button>
        )}
      </div>
      <div className='bh-logo'>
        <img src='/bad-harzburg-stiftung-logo.png'></img>
      </div>
    </div>
  );
};

export default TopBar;
