import React, { useState } from 'react';
import BrowseView from './browse/BrowseView';
import SearchView from './search/SearchView';
import './GalleryView.scss';
import NavigationBar from '../../components/NavigationBar';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';

const GalleryView = (params?: { target?: string; searchParams?: any; path?: string[] }) => {
  const { t } = useTranslation();

  const [scrollPos, setScrollPos] = useState<number>();
  const [scrollHeight, setScrollHeight] = useState<number>();

  const switchView = () => {
    switch (params?.target) {
      case 'browse':
        return (
          <BrowseView
            path={params.path}
            scrollPos={scrollPos ?? 0}
            scrollHeight={scrollHeight ?? 0}
          />
        );
      case 'search':
        return <SearchView params={params.searchParams} scrollPos={scrollPos ?? 0} />;
      default:
        return '404 - Not found';
    }
  };

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

  return (
    <div className='gallery-view'>
      <PerfectScrollbar
        options={{ suppressScrollX: true, useBothWheelAxes: false }}
        onScrollY={container => {
          setScrollPos(container.scrollTop);
          setScrollHeight(container.scrollHeight);
        }}
      >
        {switchView()}
      </PerfectScrollbar>
      <NavigationBar elements={menuItems} />
    </div>
  );
};

export default GalleryView;
