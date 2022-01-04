import React from 'react';
import { useTranslation } from 'react-i18next';
import './BrowseView.scss';
import {
  useGetCategoryInfoQuery,
  useGetLatestPicturesCategoryInfoQuery,
  CategoryTag,
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

const DisplayPicturesByCategories = ({
  result,
  categoryTags,
  path,
  scrollPos,
  scrollHeight,
  where,
}: {
  result: any;
  categoryTags: any;
  path: string[] | undefined;
  scrollPos: number;
  scrollHeight: number;
  where?: JSON | null;
}) => {
  const { t } = useTranslation();
  if (result.error) {
    return <QueryErrorDisplay error={result.error} />;
  } else if (result.loading) {
    return <Loading />;
  } else if (categoryTags.length && categoryTags[0]) {
    const category = categoryTags[0];
    const relatedTagsSize = category.related_tags?.length ?? 0;
    let baum = {};
    if (!where) {
      baum = { category_tags: category.id };
    } else {
      baum = { ...baum, ...where };
    }
    return (
      <div className='browse-view'>
        {relatedTagsSize > 0 && (
          <SubCategories
            relatedTags={category.related_tags as { thumbnail: any[]; name: string }[]}
            path={path}
          />
        )}
        <PictureScrollGrid
          where={baum}
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

const CommunityView = ({
  path,
  scrollPos,
  scrollHeight,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const where = null;
  const communityDate = '2021-11-24';

  const result = useGetLatestPicturesCategoryInfoQuery({
    variables: { date: communityDate },
  });
  {
    ('published_at_gt: 2021-11-24');
  }
  //var categoryTags = new Set<CategoryTag>();
  const categoryTags = new Set<CategoryTag | void>(
    result.data?.pictures?.map(picture => {
      picture?.category_tags;
    })
  );
  return DisplayPicturesByCategories({
    result,
    categoryTags,
    path,
    scrollPos,
    scrollHeight,
    where,
  });
};

const BrowseView = ({
  path,
  scrollPos,
  scrollHeight,
  communityMode = false,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
  communityMode?: boolean;
}) => {
  //const communityDate = '2021-11-24';
  if (communityMode) {
    return <CommunityView scrollPos={scrollPos} scrollHeight={scrollHeight} path={path} />;
  } else {
    return <DefaultBrowseView scrollPos={scrollPos} scrollHeight={scrollHeight} path={path} />;
  }
};

const DefaultBrowseView = ({
  path,
  scrollPos,
  scrollHeight,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const { t } = useTranslation();
  const where = null;
  const variables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };

  const result = useGetCategoryInfoQuery({
    variables,
  });
  const categoryTags = result.data?.categoryTags;

  return DisplayPicturesByCategories({
    result,
    categoryTags,
    path,
    scrollPos,
    scrollHeight,
    where,
  });
};
export default BrowseView;
