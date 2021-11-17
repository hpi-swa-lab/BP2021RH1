import React from 'react';
import './ItemList.scss';

export interface ItemListItem {
  name: string;
  background: string;
  color: string;
  target?: string;
  onClick?: () => void;
}

const ItemList = (props: { items: ItemListItem[]; compact?: boolean }) => {
  return (
    <div className='item-list large'>
      {props.items.map((item, index) => {
        return (
          <div
            className='item'
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
            }}
            key={index}
          >
            <div className='image-container'>
              <img src={item.background} />
            </div>
            <div className='color-overlay' style={{ backgroundColor: item.color }} />
            <div className='text-container'>
              <span> {item.name.toUpperCase()} </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
