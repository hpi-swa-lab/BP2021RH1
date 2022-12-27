import React, { useCallback } from 'react';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import Loading from '../../common/Loading';
import ScrollableItemList from '../../common/ScrollableItemList';
import { asApiPath } from '../../App';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import useAdvancedSearch from './helpers/useAdvancedSearch';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';
import { SearchType } from './helpers/search-filters';

const TagList = ({ type }: { type: TagType }) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';

  const { tagsWithThumbnailQuery } = useGenericTagEndpoints(type);

  const { data, loading, error, fetchMore } = tagsWithThumbnailQuery({
    variables: {
      start: 0,
      limit: 30,
    },
  });

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

  const fetchMoreOnScroll = useCallback(
    (count: number) => {
      // Generic endpoint results to type issues with fetchMore
      //@ts-ignore
      fetchMore({
        variables: {
          start: flattenedTags?.length,
          limit: count,
        },
      });
    },
    [fetchMore, flattenedTags]
  );

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (flattenedTags?.length) {
    return (
      <ScrollableItemList
        compact={true}
        fetchMoreOnScroll={fetchMoreOnScroll}
        items={flattenedTags.map(tag => ({
          name: tag.name,
          background: tag.thumbnail.length
            ? asApiPath(
                String(tag.thumbnail[0].media?.formats?.small?.url || DEFAULT_THUMBNAIL_URL)
              )
            : DEFAULT_THUMBNAIL_URL,
          onClick: () => {
            const { searchPath } = addNewParamToSearchPath(
              useAdvancedSearch ? type : SearchType.ALL,
              encodeURIComponent(tag.name)
            );
            history.push(searchPath, {
              showBack: true,
            });
          },
        }))}
      />
    );
  } else return <div>{t('something-went-wrong')}</div>;
};

export default TagList;
