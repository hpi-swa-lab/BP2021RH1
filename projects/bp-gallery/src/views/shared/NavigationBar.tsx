import { Icon } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';
import { useTranslation } from 'react-i18next';
import LoginDialog from './LoginDialog';
import { AuthRole, useAuth } from '../../AuthWrapper';

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
        <NavLink to='/browse' className='nav-element'>
          <Icon>book</Icon>
          <span className='nav-element-title'>{t('common.browse')}</span>
        </NavLink>
        <NavLink to='/search' className='nav-element'>
          <Icon>search</Icon>
          <span className='nav-element-title'>{t('common.search')}</span>
        </NavLink>
        <div
          className='nav-element'
          onClick={role === AuthRole.PUBLIC ? () => setOpenLogin(true) : logout}
        >
          <Icon>login</Icon>
          <span className='nav-element-title'>
            {role === AuthRole.PUBLIC ? t('login.title') : t('login.logout')}
          </span>
        </div>
        {role >= AuthRole.CURATOR && (
          <>
            <NavLink to='/uploads-overview' className='nav-element'>
              <Icon>upload</Icon>
              <span className='nav-element-title'>{t('curator.uploads')}</span>
            </NavLink>
            <NavLink to='/tags/keywords' className='nav-element'>
              <Icon>sell</Icon>
              <span className='nav-element-title'>{t('pictureFields.keywords')}</span>
            </NavLink>
            <NavLink to='/tags/locations' className='nav-element'>
              <Icon>place</Icon>
              <span className='nav-element-title'>{t('pictureFields.locations')}</span>
            </NavLink>
            <NavLink to='/tags/people' className='nav-element'>
              <Icon>person</Icon>
              <span className='nav-element-title'>{t('pictureFields.people')}</span>
            </NavLink>
            <NavLink to='/comment-overview' className='nav-element'>
              <Icon>chat</Icon>
              <span className='nav-element-title'>{t('common.comments')}</span>
            </NavLink>
            <NavLink to='/collections-overview' className='nav-element'>
              <Icon>folder</Icon>
              <span className='nav-element-title'>{t('pictureFields.collections')}</span>
            </NavLink>
          </>
        )}
      </div>
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};
export default NavigationBar;
