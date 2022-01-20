import React from 'react';
import { useTranslation } from 'react-i18next';
import './BrowseView.scss';
import { useGetCategoryInfoQuery } from '../../../graphql/APIConnector';
import { useFlatQueryResponseData } from '../../../graphql/queryUtils';
import SubCategories from './SubCategories';
import PictureScrollGrid from '../common/PictureScrollGrid';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import Loading from '../../../components/Loading';
import CategoryDescription from './CategoryDescription';

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

  const { data, loading, error } = useGetCategoryInfoQuery({ variables });
  const { categoryTags } = useFlatQueryResponseData(data) || {};

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (categoryTags?.length && categoryTags[0]) {
    const category = categoryTags[0];
    const relatedTagsSize = category.related_tags?.length ?? 0;

    return (
      <div className='browse-view'>
        <CategoryDescription description={category.description ?? ''} name={category.name} />
        {relatedTagsSize > 0 && (
          <SubCategories
            relatedTags={category.related_tags as { thumbnail: any[]; name: string }[]}
            path={path}
          />
        )}
        <PictureScrollGrid
          filters={{
            category_tags: {
              id: {
                eq: category.id,
              },
            },
          }}
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
