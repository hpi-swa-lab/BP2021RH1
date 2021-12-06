import React, { useEffect, useState } from 'react';
import ItemList from '../common/ItemList';
import './BrowseView.scss';
import apiConnector from '../../../ApiConnector';
import { useHistory } from 'react-router-dom';
import PictureGrid from '../common/PictureGrid';
import { History } from 'history';
import { apiBase } from '../../../App';
import { useGetCategoryInfoQuery } from '../../../graphql/APIConnector';

export function encodeBrowsePathComponent(folder: string): string {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
}

export function decodeBrowsePathComponent(folder: string): string {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
}

const SubCategories = ({
  relatedTags,
  path,
}: {
  relatedTags?: { thumbnail: any[]; name: string }[];
  path?: string[];
}) => {
  const history: History = useHistory();
  const formatCategoryPath = (name: string) => {
    return `/browse/${
      path
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
  const items = relatedTags?.map((tag, i) => buildItem(tag, i)) ?? [];
  return <ItemList items={items} />;
};

const BrowseView = ({
  path,
  scrollPos,
  scrollHeight,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const history: History = useHistory();
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [pictures, setPictures] = useState<any>([]);
  const [_, setLastStart] = useState<number>(0);

  const { data, loading, error } = useGetCategoryInfoQuery({
    variables: {
      categoryName: path?.length
        ? decodeBrowsePathComponent(path[path.length - 1])
        : 'Das Herbert-Ahrens-Bilderarchiv',
    },
  });

  // Load subcategories and category info on initial rendering of the component
  useEffect(() => {
    apiConnector.getCategoryInfo(path ?? []).then((info: any) => {
      setCategoryInfo(info);
    });
  }, [path, history]);

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
      !scrollPos ||
      !scrollHeight ||
      scrollPos <= scrollHeight - window.innerHeight
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
  }, [scrollPos, scrollHeight, categoryInfo]);

  if (loading) {
    return <div>Loading...</div>;
  } else if (!error && data?.categoryTags?.length) {
    return (
      <div className='browse-view'>
        <SubCategories
          relatedTags={data.categoryTags[0]?.related_tags as { thumbnail: any[]; name: string }[]}
        />
        <PictureGrid pictures={pictures} hashBase={String(categoryInfo?.name || '')} />
      </div>
    );
  } else {
    return <div>Error</div>;
  }
};

export default BrowseView;
