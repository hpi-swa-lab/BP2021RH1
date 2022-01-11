import React, { useState } from 'react';
import BrowseView from './browse/BrowseView';
import SearchView from './search/SearchView';
import './GalleryView.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CommunityView from './browse/CommunityView';

const GalleryView = ({ target, path }: { target?: string; path?: string[] }) => {
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
            path={path}
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
