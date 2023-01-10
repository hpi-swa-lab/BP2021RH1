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
import ItemList from '../../common/ItemList';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
} from '../../../graphql/APIConnector';

const TagList = ({
  type,
  scroll = true,
  onClickBasePath,
  maxItemAmount,
  currentItemAmount,
  queryParams,
}: {
  type: TagType;
  scroll?: boolean;
  onClickBasePath?: string;
  maxItemAmount?: number;
  currentItemAmount?: number;
  queryParams?: LocationTagFiltersInput | PersonTagFiltersInput | KeywordTagFiltersInput;
}) => {
  const history: History = useHistory();
  const { t } = useTranslation();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';

  const { tagsWithThumbnailQuery } = useGenericTagEndpoints(type);

  const { data, loading, error, fetchMore } = tagsWithThumbnailQuery({
    variables: {
      filters: queryParams,
      start: 0,
      limit: maxItemAmount ? maxItemAmount : 30,
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
      <div>
        {scroll && (
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
        )}
        {!scroll && onClickBasePath && (
          <ItemList
            items={(currentItemAmount
              ? flattenedTags.slice(0, currentItemAmount)
              : flattenedTags
            ).map(tag => ({
              name: tag.name,
              background: tag.thumbnail.length
                ? asApiPath(
                    String(tag.thumbnail[0].media?.formats?.small?.url || DEFAULT_THUMBNAIL_URL)
                  )
                : DEFAULT_THUMBNAIL_URL,
              onClick: () => {
                history.push(onClickBasePath + tag.id, {
                  showBack: true,
                });
              },
            }))}
          />
        )}
      </div>
    );
  } else return <div>{t('something-went-wrong')}</div>;
};

export default TagList;
