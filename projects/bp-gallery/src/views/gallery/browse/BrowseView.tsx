import React, { useEffect, useState } from 'react';
import ItemList, { ItemListItem } from '../common/ItemList';
import './BrowseView.scss';
import apiConnector, { apiBase } from '../../../ApiConnector';
import { useHistory } from 'react-router-dom';
import PictureGrid from '../common/PictureGrid';
import { History } from 'history';

export function encodeBrowsePathComponent(folder: string): string {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
}

export function decodeBrowsePathComponent(folder: string): string {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
}

const BrowseView = (params?: { path?: string[]; scrollPos: number; scrollHeight: number }) => {
  const history: History = useHistory();
  const [items, setItems] = useState<ItemListItem[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [pictures, setPictures] = useState<any>([]);
  const [lastStart, setLastStart] = useState<number>(0);

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
    apiConnector.getCategoryInfo(params?.path ?? []).then((info: any) => {
      setCategoryInfo(info);
    });
  }, [params?.path, history]);

  useEffect(() => {
    if (!categoryInfo) {
      return;
    }
    apiConnector.queryPicturesGraphQL(`{category_tags: ${String(categoryInfo.id)}}`).then(pics => {
      setPictures(pics);
    });
  }, [categoryInfo]);

  useEffect(() => {
    if (
      !categoryInfo ||
      !params?.scrollPos ||
      !params.scrollHeight ||
      params.scrollPos <= params.scrollHeight - window.innerHeight
    ) {
      return;
    }
    setLastStart(oldValue => {
      apiConnector
        .queryPicturesGraphQL(`{category_tags: ${String(categoryInfo.id)}}`, 100, oldValue)
        .then(pics => {
          setPictures((oldPictures: any) => ({ ...oldPictures, ...pics }));
        });
      return oldValue + 10;
    });
  }, [params?.scrollPos, params?.scrollHeight, categoryInfo]);

  return (
    <div className='browse-view'>
      <ItemList items={items} />
      <PictureGrid pictures={pictures} hashBase={String(categoryInfo?.name || '')} />
    </div>
  );
};

export default BrowseView;
