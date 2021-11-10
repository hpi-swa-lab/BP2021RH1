import React, { useEffect, useState } from 'react';
import ItemList, { ItemListItem } from '../common/ItemList';
import './BrowseView.scss';
import apiConnector from '../../../ApiConnector';

const BrowseView = () => {
  const [items, setItems] = useState<ItemListItem[]>([]);

  useEffect(() => {
    apiConnector
      .getCategories({
        priority: 2,
      })
      .then(async (val: any[]) => {
        setItems(
          await Promise.all(
            val.map(async (i, indx) => ({
              name: i.name,
              background: `${apiConnector._apiBase}${
                (
                  await apiConnector.queryPictures({ _limit: 1, category_tags: i.id })
                )[0].media.url as string
              }`,
              color: indx % 2 === 0 ? '#7E241D' : '#404272',
            }))
          )
        );
      });
  }, []);

  return (
    <div className='browse-view'>
      <ItemList items={items} />
    </div>
  );
};

export default BrowseView;
