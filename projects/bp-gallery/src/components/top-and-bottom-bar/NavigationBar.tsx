import {
  AdminPanelSettings,
  Book,
  Chat,
  ContactMail,
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
import {
  useCanUseAdminView,
  useCanUseCollectionCuratingView,
  useCanUseKeywordTagTableView,
  useCanUseLocationTagTableView,
  useCanUseMyAccountView,
  useCanUsePersonTagTableView,
  useCanUseUnverifiedCommentsView,
  useCanUseUploadsView,
} from '../../hooks/can-do-hooks';
import { useAuth } from '../../hooks/context-hooks';
import LoginDialog from './LoginDialog';
import './NavigationBar.scss';

const NavigationBar = ({ isMobile }: { isMobile?: boolean }) => {
  const { t } = useTranslation();

  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const { loggedIn, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // When a user successfully logs in, the Dialog closes
  useEffect(() => {
    if (loggedIn) {
      setOpenLogin(false);
    }
  }, [loggedIn]);

  const { canUseUploadsView } = useCanUseUploadsView();
  const { canRun: canUseKeywordTagTableView } = useCanUseKeywordTagTableView();
  const { canRun: canUseLocationTagTableView } = useCanUseLocationTagTableView();
  const { canRun: canUsePersonTagTableView } = useCanUsePersonTagTableView();
  const { canUseUnverifiedCommentsView } = useCanUseUnverifiedCommentsView();
  const { canUseCollectionCuratingView } = useCanUseCollectionCuratingView();
  const { canUseAdminView } = useCanUseAdminView();
  const { canUseMyAccountView } = useCanUseMyAccountView();

  const moreMenuItems = useMemo(() => {
    return [
      {
        to: '/uploads-overview',
        icon: <Upload />,
        title: t('curator.uploads'),
        active: canUseUploadsView,
      },
      {
        to: '/tags/keywords',
        icon: <Sell />,
        title: t('pictureFields.keywords'),
        active: canUseKeywordTagTableView,
      },
      {
        to: '/tags/locations',
        icon: <Place />,
        title: t('pictureFields.locations'),
        active: canUseLocationTagTableView,
      },
      {
        to: '/tags/people',
        icon: <Person />,
        title: t('pictureFields.people'),
        active: canUsePersonTagTableView,
      },
      {
        to: '/comment-overview',
        icon: <Chat />,
        title: t('common.comments'),
        active: canUseUnverifiedCommentsView,
      },
      {
        to: '/collections-overview',
        icon: <Folder />,
        title: t('pictureFields.collections'),
        active: canUseCollectionCuratingView,
      },
      {
        to: '/admin',
        icon: <AdminPanelSettings />,
        title: t('admin.title'),
        active: canUseAdminView,
      },
      {
        to: '/my-account',
        icon: <ContactMail />,
        title: t('admin.myAccount.title'),
        active: canUseMyAccountView,
      },
    ].filter(item => item.active);
  }, [
    t,
    canUseUploadsView,
    canUseKeywordTagTableView,
    canUseLocationTagTableView,
    canUsePersonTagTableView,
    canUseUnverifiedCommentsView,
    canUseCollectionCuratingView,
    canUseAdminView,
    canUseMyAccountView,
  ]);

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
        {moreMenuItems.length > 0 && (
          <>
            <div className='nav-element' onClick={event => setAnchorEl(event.currentTarget)}>
              <MenuIcon />
              <span className='nav-element-title'>{t('common.more')}</span>
            </div>
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
              {moreMenuItems.map(item => (
                <MenuItem component={NavLink} key={item.to} to={item.to}>
                  {item.icon}
                  <span className='nav-element-title'>{item.title}</span>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </div>
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};
export default NavigationBar;
