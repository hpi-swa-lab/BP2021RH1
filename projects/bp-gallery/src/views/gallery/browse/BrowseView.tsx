import React, { useEffect, useState } from 'react';
import ItemList, { ItemListItem } from '../common/ItemList';
import './BrowseView.scss';
import apiConnector, { apiBase } from '../../../ApiConnector';
import { useHistory } from 'react-router-dom';

export function encodeBrowsePathComponent(folder: string): string {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
}

export function decodeBrowsePathComponent(folder: string): string {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
}

const BrowseView = (params?: { path?: string[] }) => {
  const history = useHistory();
  const [items, setItems] = useState<ItemListItem[]>([]);

  useEffect(() => {
    apiConnector
      .getCategories(params?.path ?? [])
      .then(async (categories: { thumbnail: any[]; name: string }[]) => {
        setItems(
          await Promise.all(
            categories.map(async (category, indx) => {
              const formats = category.thumbnail[0].media.formats;

              return {
                name: decodeBrowsePathComponent(category.name),
                background: `${apiBase}/${String(
                  formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || ''
                )}`,
                color: indx % 2 === 0 ? '#7E241D' : '#404272',
                onClick: () => {
                  history.push(
                    `/browse/${
                      params?.path
                        ?.map(folder => {
                          return encodeBrowsePathComponent(folder);
                        })
                        .join('/') ?? ''
                    }/${encodeBrowsePathComponent(category.name)}`.replace(/\/+/gm, '/'),
                    { showBack: true }
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
