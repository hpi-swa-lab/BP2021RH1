import { Alert, Button, Dialog, Icon, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';
import { useTranslation } from 'react-i18next';
import LoginScreen from './LoginScreen';
import { authRole, useAuth } from '../AuthWrapper';

const NavigationBar = () => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const { role, logout } = useAuth();

  // When a user successfully logs in, the Dialog closes and a success-message gets displayed
  useEffect(() => {
    if (role === authRole.PUBLIC) return;
    setOpenLogin(false);
    setSuccessAlertMessage(t('common.successful-login'));
  }, [role, t]);

  const onLogout = () => {
    logout();
    setSuccessAlertMessage(t('common.successful-logout'));
  };

  return (
    <>
      <div className='nav-bar'>
        <NavLink to={'/browse'} className='nav-element'>
          <Icon>book</Icon>
          <span className='nav-element-title'>{t('common.browse')}</span>
        </NavLink>
        <NavLink to={'/search'} className='nav-element'>
          <Icon>search</Icon>
          <span className='nav-element-title'>{t('common.search')}</span>
        </NavLink>
        <div
          className='nav-element'
          onClick={role === authRole.PUBLIC ? () => setOpenLogin(true) : onLogout}
        >
          <Icon>login</Icon>
          <span className='nav-element-title'>
            {role === authRole.PUBLIC ? t('common.login') : t('common.logout')}
          </span>
        </div>
      </div>
      <Dialog open={openLogin} fullWidth={true} onBackdropClick={() => setOpenLogin(false)}>
        <Button onClick={() => setOpenLogin(false)} className='close-button'>
          <Icon fontSize='large'>close</Icon>
        </Button>
        <LoginScreen />
      </Dialog>
      <Snackbar
        open={successAlertMessage !== undefined}
        autoHideDuration={2000}
        onClose={() => setSuccessAlertMessage(undefined)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='success'>{successAlertMessage}</Alert>
      </Snackbar>
    </>
  );
};

export default NavigationBar;
