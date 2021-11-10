// import { Button, Icon } from '@mui/material';
import React from 'react';
import './TopBar.scss';

const TopBar = () => {
  return (
    <div className='top-bar'>
      <div className='actions'>
        {/* <Button>
          <Icon>arrow_back</Icon>Zurück zur Suche
        </Button> */}
      </div>
      <div className='bh-logo'>
        <img src='/bad-harzburg-stiftung-logo.png'></img>
      </div>
    </div>
  );
};

export default TopBar;
