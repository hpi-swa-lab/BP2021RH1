import { Icon, Menu, MenuItem } from 'mui';
import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';
import { useTranslation } from 'react-i18next';
import LoginDialog from './LoginDialog';
import { AuthRole, useAuth } from '../provider/AuthProvider';

const NavigationBar = ({ isMobile }: { isMobile?: boolean }) => {
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
        <NavLink to='/start' className='nav-element'>
          {isMobile && <Icon>book</Icon>}
          <span className='nav-element-title'>{t('common.start')}</span>
        </NavLink>
        <NavLink to='/search' className='nav-element'>
          {isMobile && <Icon>search</Icon>}
          <span className='nav-element-title'>{t('common.search')}</span>
        </NavLink>
        <div
          className='nav-element'
          onClick={role === AuthRole.PUBLIC ? () => setOpenLogin(true) : logout}
        >
          {isMobile && (role === AuthRole.PUBLIC ? <Icon>login</Icon> : <Icon>logout</Icon>)}
          <span className='nav-element-title'>
            {role === AuthRole.PUBLIC ? t('login.title') : t('login.logout')}
          </span>
        </div>
        {role === AuthRole.CURATOR && (
          <div className='nav-element' onClick={event => setAnchorEl(event.currentTarget)}>
            <Icon>menu</Icon>
            <span className='nav-element-title'>{t('common.more')}</span>
          </div>
        )}
        {role === AuthRole.CURATOR && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            onClick={() => setAnchorEl(null)}
            transformOrigin={
              isMobile
                ? {
                    vertical: 'bottom',
                    horizontal: 'center',
                  }
                : {
                    vertical: 'top',
                    horizontal: 'center',
                  }
            }
            anchorOrigin={
              isMobile
                ? {
                    vertical: 'top',
                    horizontal: 'center',
                  }
                : {
                    vertical: 'bottom',
                    horizontal: 'center',
                  }
            }
            className='nav-more-menu'
          >
            {curatorItems.map(item => (
              <MenuItem component={NavLink} key={item.to} to={item.to}>
                <Icon>{item.icon}</Icon>
                <span className='nav-element-title'>{item.title}</span>
              </MenuItem>
            ))}
          </Menu>
        )}
      </div>
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};
export default NavigationBar;
