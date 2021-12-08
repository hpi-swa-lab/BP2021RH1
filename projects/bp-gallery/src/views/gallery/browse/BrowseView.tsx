import React from 'react';
import { useTranslation } from 'react-i18next';
import './BrowseView.scss';
import { useGetCategoryInfoQuery } from '../../../graphql/APIConnector';
import SubCategories from './SubCategories';
import PictureScrollGrid from '../common/PictureScrollGrid';

export function encodeBrowsePathComponent(folder: string): string {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
}

export function decodeBrowsePathComponent(folder: string): string {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
}

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
        <PictureScrollGrid
          where={{ category_tags: category.id }}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
          hashbase={category.name}
        />
      </div>
    );
  } else {
    return <div>{t('common.no-category')}</div>;
  }
};

export default BrowseView;
