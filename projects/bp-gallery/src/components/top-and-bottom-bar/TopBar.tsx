import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Location } from 'history';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import SearchBar from '../views/search/SearchBar';
import { useVisit } from './../../helpers/history';
import { useScroll } from './../../hooks/context-hooks';
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
  const { visit, history } = useVisit();
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
              visit('/start', false);
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
