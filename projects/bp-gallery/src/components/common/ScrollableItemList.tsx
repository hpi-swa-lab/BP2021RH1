import React, { useState } from 'react';
import './ScrollableItemList.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Icon, IconButton } from '@mui/material';
import { ItemListItemModel } from './ItemListItem';
import ItemList from './ItemList';

const ScrollableItemList = ({
  items,
  compact,
  fetchMoreOnScroll,
}: {
  items: ItemListItemModel[];
  compact?: boolean;
  fetchMoreOnScroll?: (count: number) => void;
}) => {
  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(true);
  const [lastScrollPos, setLastScrollPos] = useState<number>(0);

  const scrollElements = (count: number) => {
    if (!scrollBarRef) {
      return;
    }
    const elementWidth = 0.22 * Math.min(window.innerHeight, window.innerWidth);
    scrollBarRef.scroll({
      top: 0,
      left: scrollBarRef.scrollLeft + elementWidth * count,
      behavior: 'auto',
    });
    if (fetchMoreOnScroll && count > 0) {
      fetchMoreOnScroll(count);
    }
  };

  return (
    <div className='item-list'>
      <PerfectScrollbar
        containerRef={ref => {
          setScrollBarRef(ref);
        }}
        onScrollX={() => {
          setShowLeftButton(true);
          setShowRightButton(true);
        }}
        onXReachStart={() => {
          setShowLeftButton(false);
        }}
        onXReachEnd={ref => {
          setShowRightButton(false);
          if (fetchMoreOnScroll && ref.scrollLeft !== lastScrollPos) {
            fetchMoreOnScroll(5);
            setLastScrollPos(ref.scrollLeft);
          }
        }}
      >
        <ItemList items={items} compact={compact} />
      </PerfectScrollbar>
      <div className='button-container'>
        <IconButton
          style={{ visibility: showLeftButton ? 'visible' : 'hidden' }}
          onClick={() => {
            scrollElements(-3);
          }}
        >
          <Icon>fast_rewind</Icon>
        </IconButton>
        <IconButton
          style={{ visibility: showRightButton ? 'visible' : 'hidden' }}
          onClick={() => {
            scrollElements(3);
          }}
        >
          <Icon>fast_forward</Icon>
        </IconButton>
      </div>
    </div>
  );
};

export default ScrollableItemList;
