import React from 'react';
import './ItemList.scss';
import { ItemListItem, ItemListItemModel } from './ItemListItem';

const ItemList = ({ items, compact }: { items: ItemListItemModel[]; compact?: boolean }) => {
  return (
    <div className={`items  ${compact ? 'compact' : 'large'}`}>
      {items.map((item, index) => (
        <ItemListItem item={item} key={index} compact={compact} />
      ))}
    </div>
  );
};

export default ItemList;
