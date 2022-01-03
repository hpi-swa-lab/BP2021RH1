import React, { useState } from 'react';
import './ItemList.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Icon, IconButton } from '@mui/material';
import { ItemListItem, ItemListItemModel } from './ItemListItem';

const ItemList = (props: { items: ItemListItemModel[]; compact?: boolean }) => {
  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(true);

  const scrollElements = (count: number) => {
    if (!scrollBarRef) {
      return;
    }
    const elementWidth = 0.22 * Math.min(window.innerHeight, window.innerWidth);
    scrollBarRef.scroll({
      top: 0,
      left: scrollBarRef.scrollLeft + elementWidth * count,
      behavior: 'smooth',
    });
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
        onXReachEnd={() => {
          setShowRightButton(false);
        }}
      >
        <div className='items'>
          {props.items.map((item, index) => (
            <ItemListItem item={item} key={index} />
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
