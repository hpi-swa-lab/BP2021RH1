import React, { useEffect, useState } from 'react';
import ItemList, { ItemListItem } from '../common/ItemList';
import './BrowseView.scss';
import apiConnector, { apiBase } from '../../../ApiConnector';
import { useHistory } from 'react-router-dom';

const BrowseView = (params?: { path?: string[] }) => {
  const history = useHistory();
  const [items, setItems] = useState<ItemListItem[]>([]);

  useEffect(() => {
    apiConnector.getCategories(params?.path ?? []).then(async (categories: any[]) => {
      setItems(
        await Promise.all(
          categories.map(async (category, indx) => {
            const formats = category.thumbnail[0].media.formats;

            return {
              name: decodeURIComponent(category.name),
              background: `${apiBase}/${String(
                formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || ''
              )}`,
              color: indx % 2 === 0 ? '#7E241D' : '#404272',
              onClick: () => {
                console.log(params?.path);
                console.log(
                  `/browse/${
                    params?.path
                      ?.map(folder => {
                        return encodeURIComponent(folder);
                      })
                      .join('/') ?? ''
                  }/${encodeURIComponent(category.name)}`.replace(/\/+/gm, '/')
                );
                history.push(
                  `/browse/${
                    params?.path
                      ?.map(folder => {
                        return encodeURIComponent(folder);
                      })
                      .join('/') ?? ''
                  }/${encodeURIComponent(category.name)}`.replace(/\/+/gm, '/')
                );
              },
            };
          })
        )
      );
    });
  }, [params?.path, history]);

  return (
    <div className='browse-view'>
      <ItemList items={items} />
    </div>
  );
};

export default BrowseView;
