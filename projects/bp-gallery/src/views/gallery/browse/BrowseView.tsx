import React, { useEffect, useState } from 'react';
import ItemList, { ItemListItem } from '../common/ItemList';
import './BrowseView.scss';
import apiConnector from '../../../ApiConnector';
import { useHistory } from 'react-router-dom';
import PictureGrid from '../common/PictureGrid';
import { History } from 'history';
import { apiBase } from '../../../App';

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
  const [_, setLastStart] = useState<number>(0);

  // Load subcategories and category info on initial rendering of the component
  useEffect(() => {
    const formatCategoryPath = (name: string) => {
      return `/browse/${
        params?.path
          ?.map(folder => {
            return encodeBrowsePathComponent(folder);
          })
          .join('/') ?? ''
      }/${encodeBrowsePathComponent(name)}`.replace(/\/+/gm, '/');
    };

    const buildItem = (category: { thumbnail: any[]; name: string }, index: number) => {
      const formats = category.thumbnail[0].media.formats;
      return {
        name: decodeBrowsePathComponent(category.name),
        background: `${apiBase}/${String(
          formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || ''
        )}`,
        color: index % 2 === 0 ? '#7E241D' : '#404272',
        onClick: () => {
          history.push(formatCategoryPath(category.name), { showBack: true });
        },
      };
    };

    apiConnector
      .getCategories(params?.path ?? [])
      .then(async (categories: { thumbnail: any[]; name: string }[]) => {
        setItems(
          await Promise.all(
            categories.map(async (category, index) => {
              return buildItem(category, index);
            })
          )
        );
      });
    apiConnector.getCategoryInfo(params?.path ?? []).then((info: any) => {
      setCategoryInfo(info);
    });
  }, [params?.path, history]);

  // Load images on category navigation
  useEffect(() => {
    if (!categoryInfo?.id) {
      return;
    }
    apiConnector.queryPicturesGraphQL(`{category_tags: ${String(categoryInfo.id)}}`).then(pics => {
      setPictures(pics);
    });
  }, [categoryInfo?.id]);

  // Enable endless scrolling
  useEffect(() => {
    if (
      !categoryInfo ||
      !params?.scrollPos ||
      !params.scrollHeight ||
      params.scrollPos <= params.scrollHeight - window.innerHeight
    ) {
      return;
    }
    setLastStart(lastStart => {
      apiConnector
        .queryPicturesGraphQL(`{category_tags: ${String(categoryInfo.id)}}`, 100, lastStart)
        .then(pics => {
          setPictures((oldPictures: any) => ({ ...oldPictures, ...pics }));
        });
      return lastStart + 100;
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
