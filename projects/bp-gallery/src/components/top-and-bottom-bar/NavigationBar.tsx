import { Icon, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';
import { useTranslation } from 'react-i18next';
import LoginDialog from './LoginDialog';
import { AuthRole, useAuth } from '../provider/AuthProvider';

const NavigationBar = () => {
  const { t } = useTranslation();

  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const { role, logout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // When a user successfully logs in, the Dialog closes
  useEffect(() => {
    setOpenLogin(false);
  }, [role]);

  const curatorItems = useMemo(() => {
    return [
      {
        to: '/uploads-overview',
        icon: 'upload',
        title: t('curator.uploads'),
      },
      {
        to: '/tags/keywords',
        icon: 'sell',
        title: t('pictureFields.keywords'),
      },
      {
        to: '/tags/locations',
        icon: 'place',
        title: t('pictureFields.locations'),
      },
      {
        to: '/tags/people',
        icon: 'person',
        title: t('pictureFields.people'),
      },
      {
        to: '/comment-overview',
        icon: 'chat',
        title: t('common.comments'),
      },
      {
        to: '/collections-overview',
        icon: 'folder',
        title: t('pictureFields.collections'),
      },
    ];
  }, [t]);

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
        <div className='nav-element' onClick={event => setAnchorEl(event.currentTarget)}>
          <Icon>menu</Icon>
          <span className='nav-element-title'>{t('common.more')}</span>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          className='nav-more-menu'
        >
          <MenuItem onClick={role === AuthRole.PUBLIC ? () => setOpenLogin(true) : logout}>
            <Icon>login</Icon>
            <span className='nav-element-title'>
              {role === AuthRole.PUBLIC ? t('login.title') : t('login.logout')}
            </span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.open(`mailto:${process.env.REACT_APP_CONTACT_MAIL ?? ''}`);
            }}
          >
            <Icon>mail</Icon>
            <span className='nav-element-title'>{t('common.contact')}</span>
          </MenuItem>
          {role >= AuthRole.CURATOR &&
            curatorItems.map(item => (
              <MenuItem component={NavLink} key={item.to} to={item.to}>
                <Icon>{item.icon}</Icon>
                <span className='nav-element-title'>{item.title}</span>
              </MenuItem>
            ))}
        </Menu>
      </div>
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};
export default NavigationBar;
