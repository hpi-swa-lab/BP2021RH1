import React, { useRef, useState } from 'react';
import './ItemList.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Icon, IconButton } from '@mui/material';
import { ItemListItem, ItemListItemModel } from './ItemListItem';

const ItemList = (props: { items: ItemListItemModel[]; compact?: boolean }) => {
  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

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
    <div className={`item-list ${props.compact ? 'compact' : 'large'}`} ref={listRef}>
      <PerfectScrollbar
        containerRef={ref => {
          setScrollBarRef(ref);
        }}
        onScrollX={() => {
          setScrollPosition(scrollBarRef?.scrollLeft ?? 0);
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
          style={{ visibility: scrollPosition > 0 ? 'visible' : 'hidden' }}
          onClick={() => {
            scrollElements(-3);
          }}
        >
          <Icon>fast_rewind</Icon>
        </IconButton>
        <IconButton
          style={{
            visibility:
              scrollPosition <
              (scrollBarRef?.scrollWidth || 0) -
                (listRef.current?.getBoundingClientRect()?.width ?? 0)
                ? 'visible'
                : 'hidden',
          }}
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
