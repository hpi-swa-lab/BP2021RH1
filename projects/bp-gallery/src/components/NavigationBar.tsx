import { Icon } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';
import { useTranslation } from 'react-i18next';
import LoginDialog from './LoginDialog';
import { authRole, useAuth } from '../AuthWrapper';

const NavigationBar = () => {
  const { t } = useTranslation();

  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const { role, logout } = useAuth();

  // When a user successfully logs in, the Dialog closes
  useEffect(() => {
    setOpenLogin(false);
  }, [role]);

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
          onClick={role === authRole.PUBLIC ? () => setOpenLogin(true) : logout}
        >
          <Icon>login</Icon>
          <span className='nav-element-title'>
            {role === authRole.PUBLIC ? t('login.title') : t('login.logout')}
          </span>
        </div>
      </div>
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};
export default NavigationBar;
