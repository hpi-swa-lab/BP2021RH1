import React, { useState } from 'react';
import BrowseView from './browse/BrowseView';
import SearchView from './search/SearchView';
import './GalleryView.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';

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
        return <BrowseView path={path} {...scrollParams} communityView={false} />;
      case 'browse/latest':
        return <BrowseView path={path} {...scrollParams} communityView={true} />;
      case 'search':
        return <SearchView {...scrollParams} />;
      default:
        return '404 - Not found';
    }
  };

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
    </div>
  );
};

export default GalleryView;
