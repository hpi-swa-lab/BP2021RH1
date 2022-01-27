import { Button, Dialog, Icon } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';
import { useTranslation } from 'react-i18next';
import LoginScreen from './LoginScreen';
import { authRole, useAuth } from '../AuthWrapper';

const NavigationBar = () => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const { t } = useTranslation();

  const { role, logout } = useAuth();

  useEffect(() => {
    setOpenLogin(false);
  }, [role]);

  return (
    <div className='nav-bar'>
      <NavLink to={'/browse'} className='nav-element'>
        <Icon>book</Icon>
        <span className='nav-element-title'>{t('common.browse')}</span>
      </NavLink>
      <NavLink to={'/search'} className='nav-element'>
        <Icon>search</Icon>
        <span className='nav-element-title'>{t('common.search')}</span>
      </NavLink>
      <Button
        className='nav-element'
        onClick={role === authRole.PUBLIC ? () => setOpenLogin(true) : logout}
      >
        <Icon>login</Icon>
        <span>{role === authRole.PUBLIC ? t('common.login') : t('common.logout')}</span>
      </Button>
      <Dialog open={openLogin} fullWidth={true}>
        <Button onClick={() => setOpenLogin(false)} className='close-button'>
          <Icon>close</Icon>
        </Button>
        <LoginScreen />
      </Dialog>
    </div>
  );
};

export default NavigationBar;
