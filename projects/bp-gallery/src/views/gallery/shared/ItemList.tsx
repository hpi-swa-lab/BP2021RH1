import React, { useState } from 'react';
import './ItemList.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Icon, IconButton } from '@mui/material';
import { ItemListItem, ItemListItemModel } from './ItemListItem';
import { browserName } from 'react-device-detect';

const ItemList = (props: {
  items: ItemListItemModel[];
  compact?: boolean;
  fetchMoreOnScroll?: (count: number) => void;
}) => {
  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(true);
  const [lastScrollPos, setLastScrollPos] = useState<number>(0);

  const isFirefox = browserName === 'Firefox';
  const isSafari = browserName === 'Safari';

  const scrollElements = (count: number) => {
    if (!scrollBarRef) {
      return;
    }
    const elementWidth = 0.22 * Math.min(window.innerHeight, window.innerWidth);
    scrollBarRef.scroll({
      top: 0,
      left: scrollBarRef.scrollLeft + elementWidth * count,
      behavior: isFirefox || isSafari ? 'auto' : 'smooth',
    });
    if (props.fetchMoreOnScroll && count > 0) {
      props.fetchMoreOnScroll(count);
    }
  };

  return (
    <div className={`item-list ${props.compact ? 'compact' : 'large'}`}>
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
          if (props.fetchMoreOnScroll && ref.scrollLeft !== lastScrollPos) {
            props.fetchMoreOnScroll(5);
            setLastScrollPos(ref.scrollLeft);
          }
        }}
      >
        <div className='items'>
          {props.items.map((item, index) => (
            <ItemListItem item={item} key={index} compact={props.compact} />
          ))}
        </div>
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

export default ItemList;
