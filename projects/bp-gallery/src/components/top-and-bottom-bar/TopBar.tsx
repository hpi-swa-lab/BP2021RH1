import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { History, Location } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import SearchBar from '../views/search/SearchBar';
import { useScroll } from './../../hooks/scrolll-hook';
import NavigationBar from './NavigationBar';
import './TopBar.scss';

type LocationProps = {
  state?: {
    showBack: boolean;
  };
};

const TopBar = ({ isMobile }: { isMobile?: boolean }) => {
  const { t } = useTranslation();

  const { scrollTo } = useScroll();
  const history: History = useHistory();
  const { search, pathname }: Location = useLocation();

  return (
    <div className='top-bar'>
      <div className='action-wrapper'>
        {(history.location as LocationProps).state?.showBack ? (
          <div className='actions'>
            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              <ArrowBack />
              {t('common.back')}
            </Button>
          </div>
        ) : (
          <div
            className={'bh-logo clickable'}
            title={t('common.back-to-home')}
            onClick={() => {
              if (pathname === '/start') {
                scrollTo?.(0, true);
                return;
              }
              history.push('/start', { showBack: false });
            }}
          >
            <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
          </div>
        )}
      </div>
      <div className='search-div'>
        <SearchBar
          searchParams={new URLSearchParams(search)}
          isAllSearchActive={true}
          isTopBarSearch={true}
        />
      </div>
      <div className='divider' />
      {!isMobile && <NavigationBar />}
    </div>
  );
};

export default TopBar;
