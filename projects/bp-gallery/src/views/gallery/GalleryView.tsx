import React from 'react';
import BrowseView from './browse/BrowseView';
import SearchView from './search/SearchView';
import './GalleryView.scss';
import NavigationBar from '../../components/NavigationBar';
import { useTranslation } from 'react-i18next';

const GalleryView = (params?: { target?: string; searchParams?: any; path?: string[] }) => {
  const { t } = useTranslation();

  const switchView = () => {
    switch (params?.target) {
      case 'browse':
        return <BrowseView path={params.path} />;
      case 'search':
        return <SearchView params={params.searchParams} />;
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
      {switchView()}
      <NavigationBar elements={menuItems} />
    </div>
  );
};

export default GalleryView;
