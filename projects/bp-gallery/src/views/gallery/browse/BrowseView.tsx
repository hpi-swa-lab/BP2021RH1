import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BrowseView.scss';
import PictureGrid from '../common/PictureGrid';
import {
  Picture,
  useGetCategoryInfoQuery,
  useGetPicturesQuery,
} from '../../../graphql/APIConnector';
import SubCategories from './SubCategories';

export function encodeBrowsePathComponent(folder: string): string {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
}

export function decodeBrowsePathComponent(folder: string): string {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
}

const PicturesInCategory = ({
  categoryId,
  scrollPos,
  scrollHeight,
}: {
  categoryId: string;
  scrollPos: number;
  scrollHeight: number;
}) => {
  const { t } = useTranslation();
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(0);

  const { data, loading, error, fetchMore } = useGetPicturesQuery({
    variables: {
      where: { category_tags: categoryId },
      limit: 100,
      start: 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  //Loads the next 100 Pictures when the user scrolled to the bottom
  useEffect(() => {
    if (
      !loading &&
      scrollPos &&
      scrollHeight &&
      scrollHeight !== lastScrollHeight &&
      scrollPos > scrollHeight - 1.5 * window.innerHeight
    ) {
      fetchMore({ variables: { start: data?.pictures?.length } });
      setLastScrollHeight(scrollHeight);
    }
  }, [scrollPos, scrollHeight, lastScrollHeight, data, loading, fetchMore]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    if (data?.pictures?.length) {
      return <PictureGrid pictures={data.pictures as Picture[]} hashBase={'Werner'} />;
    } else {
      return <div>{t('common.loading')}</div>;
    }
  }
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
  const { t } = useTranslation();

  const variables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };

  const { data, loading, error } = useGetCategoryInfoQuery({
    variables,
  });

  if (error) {
    return <div>Error: {error}</div>;
  } else if (loading) {
    return <div>{t('common.loading')}</div>;
  } else if (data?.categoryTags?.length && data.categoryTags[0]) {
    const category = data.categoryTags[0];
    return (
      <div className='browse-view'>
        <SubCategories
          relatedTags={category.related_tags as { thumbnail: any[]; name: string }[]}
        />
        <PicturesInCategory
          categoryId={category.id}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
        />
      </div>
    );
  } else {
    return <div>{t('common.no-category')}</div>;
  }
};

export default BrowseView;
