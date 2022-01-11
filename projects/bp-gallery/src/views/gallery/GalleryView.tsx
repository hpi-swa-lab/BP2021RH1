import React, { useContext, useEffect, useState } from 'react';
import BrowseView from './browse/BrowseView';
import SearchView from './search/SearchView';
import './GalleryView.scss';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { NavigationContext } from '../../App';
import CommunityView from './browse/CommunityView';

const GalleryView = ({ target, path }: { target?: string; path?: string[] }) => {
  const { t } = useTranslation();

  const [scrollPos, setScrollPos] = useState<number>();
  const [scrollHeight, setScrollHeight] = useState<number>();

  const switchView = () => {
    switch (target) {
      case 'browse':
        return (
          <BrowseView path={path} scrollPos={scrollPos ?? 0} scrollHeight={scrollHeight ?? 0} />
        );
      case 'browse/latest':
        return (
          <CommunityView
            path={props.path}
            scrollPos={scrollPos ?? 0}
            scrollHeight={scrollHeight ?? 0}
          />
        );
      case 'search':
        return <SearchView scrollPos={scrollPos ?? 0} scrollHeight={scrollHeight ?? 0} />;
      default:
        return '404 - Not found';
    }
  };

  const setNavigationElements = useContext(NavigationContext);

  useEffect(() => {
    const menuItems = [
      {
        name: t('common.browse'),
        icon: 'book',
        target: '/browse',
      },
      {
        name: t('common.search'),
        icon: 'search',
        target: '/search',
      },
      {
        name: t('common.menu'),
        icon: 'menu',
        target: '/menu',
      },
    ];
    setNavigationElements(menuItems);
  }, [setNavigationElements, t]);

  return (
    <div className='gallery-view'>
      <PerfectScrollbar
        options={{ suppressScrollX: true, useBothWheelAxes: false, wheelSpeed: 0.2 }}
        onScrollY={container => {
          setScrollPos(container.scrollTop);
          setScrollHeight(container.scrollHeight);
        }}
      >
        {switchView()}
      </PerfectScrollbar>
    </div>
  );
};

export default GalleryView;
