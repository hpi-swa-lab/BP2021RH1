import {
  Book,
  Chat,
  Folder,
  ImportContacts,
  Login,
  Logout,
  Menu as MenuIcon,
  Person,
  Place,
  Search,
  Sell,
  Upload,
} from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { AuthRole } from '../provider/AuthProvider';
import LoginDialog from './LoginDialog';
import './NavigationBar.scss';
import { useAuth } from '../../hooks/context-hooks';

const NavigationBar = ({ isMobile }: { isMobile?: boolean }) => {
  const { t } = useTranslation();

  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const { role, loggedIn, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // When a user successfully logs in, the Dialog closes
  useEffect(() => {
    if (loggedIn) {
    setOpenLogin(false);
    }
  }, [loggedIn]);

  const curatorItems = useMemo(() => {
    return [
      {
        to: '/uploads-overview',
        icon: <Upload />,
        title: t('curator.uploads'),
      },
      {
        to: '/tags/keywords',
        icon: <Sell />,
        title: t('pictureFields.keywords'),
      },
      {
        to: '/tags/locations',
        icon: <Place />,
        title: t('pictureFields.locations'),
      },
      {
        to: '/tags/people',
        icon: <Person />,
        title: t('pictureFields.people'),
      },
      {
        to: '/comment-overview',
        icon: <Chat />,
        title: t('common.comments'),
      },
      {
        to: '/collections-overview',
        icon: <Folder />,
        title: t('pictureFields.collections'),
      },
    ];
  }, [t]);

  return (
    <>
      <div className='nav-bar'>
        <NavLink to='/start' className='nav-element'>
          {isMobile && <Book />}
          <span className='nav-element-title'>{t('common.start')}</span>
        </NavLink>
        <NavLink to='/search' className='nav-element'>
          {isMobile && <Search />}
          <span className='nav-element-title'>{t('common.search')}</span>
        </NavLink>
        <NavLink to='/discover' className='nav-element'>
          {isMobile && <ImportContacts />}
          <span className='nav-element-title'>Stöbern</span>
        </NavLink>
        <div className='nav-element' onClick={loggedIn ? logout : () => setOpenLogin(true)}>
          {isMobile && (loggedIn ? <Logout /> : <Login />)}
          <span className='nav-element-title'>
            {loggedIn ? t('login.logout') : t('login.title')}
          </span>
        </div>
        {role === AuthRole.CURATOR && (
          <div className='nav-element' onClick={event => setAnchorEl(event.currentTarget)}>
            <MenuIcon />
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
                {item.icon}
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
