import React, { useState } from 'react';
import BrowseView from './browse/BrowseView';
import SearchView from './search/SearchView';
import MainView from '../main/MainView';
import './GalleryView.scss';
import UploadsView from './uploads/UploadsView';

const GalleryView = ({ target, path }: { target?: string; path?: string[] }) => {
  const [scrollPos, setScrollPos] = useState<number>();
  const [scrollHeight, setScrollHeight] = useState<number>();

  const switchView = () => {
    const scrollParams = {
      scrollPos: scrollPos ?? 0,
      scrollHeight: scrollHeight ?? 0,
    };

    switch (target) {
      case 'browse':
        return (
          <BrowseView path={path} hideDescription={false} {...scrollParams} communityView={false} />
        );
      case 'browse/latest':
        return (
          <BrowseView path={path} hideDescription={false} {...scrollParams} communityView={true} />
        );
      case 'search':
        return <SearchView {...scrollParams} />;
      case 'uploads':
        return <UploadsView {...scrollParams} />;
      case 'main':
        return <MainView {...scrollParams} />;
      default:
        return '404 - Not found';
    }
  };

  return (
    <div className='gallery-view'>
      <div
        className='scrollable-container'
        onScroll={event => {
          setScrollPos((event.target as HTMLElement).scrollTop);
          setScrollHeight((event.target as HTMLElement).scrollHeight);
        }}
      >
        {switchView()}
      </div>
    </div>
  );
};

export default GalleryView;
