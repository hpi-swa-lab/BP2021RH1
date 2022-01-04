import React from 'react';
import { useTranslation } from 'react-i18next';
import './BrowseView.scss';
import {
  useGetCategoryInfoQuery,
  useGetLatestPicturesCategoryInfoQuery,
  GetLatestPicturesCategoryInfoQueryVariables,
} from '../../../graphql/APIConnector';
import SubCategories from './SubCategories';
import PictureScrollGrid from '../common/PictureScrollGrid';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import Loading from '../../../components/Loading';

export function encodeBrowsePathComponent(folder: string): string {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
}

export function decodeBrowsePathComponent(folder: string): string {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
}
function displayPicturesByCategories(
  result: any,
  categoryTags: any,
  where: JSON,
  path: string[],
  scrollPos: number,
  scrollHeight: number
) {
  if (result.error) {
    return <QueryErrorDisplay error={result.error} />;
  } else if (result.loading) {
    return <Loading />;
  } else if (categoryTags.length && categoryTags[0]) {
    const category = categoryTags[0];
    const relatedTagsSize = category.related_tags?.length ?? 0;
    return (
      <div className='browse-view'>
        {relatedTagsSize > 0 && (
          <SubCategories
            relatedTags={category.related_tags as { thumbnail: any[]; name: string }[]}
            path={path}
          />
        )}
        <PictureScrollGrid
          where
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
          hashbase={category.name}
        />
      </div>
    );
  } else {
    return <div>{t('common.no-category')}</div>;
  }
}
const BrowseView = ({
  path,
  scrollPos,
  scrollHeight,
  communityMode = false,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
  communityMode: boolean;
}) => {
  const { t } = useTranslation();
  let result, categoryTags;

  const communityDate = '2021-11-24';

  const variables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };

  if (communityMode) {
    result = useGetLatestPicturesCategoryInfoQuery({
      variables: { date: communityDate },
    });
    categoryTags = new Set<GetLatestPicturesCategoryInfoQueryVariables>();
    categoryTags = result?.data?.pictures?.map(picture => {
      picture?.category_tags;
    });
  } else {
    result = useGetCategoryInfoQuery({
      variables,
    });
    categoryTags = result?.data?.categoryTags;
  }
};

export default BrowseView;
