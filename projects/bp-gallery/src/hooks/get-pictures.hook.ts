import { WatchQueryFetchPolicy } from '@apollo/client';
import { useMemo } from 'react';
import {
  GetPicturesByAllSearchQueryVariables,
  PictureFiltersInput,
  useGetMostLikedPicturesQuery,
  useGetPicturesByAllSearchQuery,
  useGetPicturesQuery,
} from '../graphql/APIConnector';
import { PictureOverviewType } from '../types/additionalFlatTypes';

export const NUMBER_OF_PICTURES_LOADED_PER_FETCH = 100;

// should match the enum in projects/bp-strapi/src/api/picture/services/custom-resolver.ts
export enum TextFilter {
  ONLY_PICTURES = 'ONLY_PICTURES',
  PICTURES_AND_TEXTS = 'PICTURES_AND_TEXTS',
  ONLY_TEXTS = 'ONLY_TEXTS',
}

export type QueryParams = PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };

const useGetPictures = (
  queryParams: QueryParams,
  isAllSearchActive: boolean,
  sortBy?: string[],
  textFilter = TextFilter.ONLY_PICTURES,
  limit: number = NUMBER_OF_PICTURES_LOADED_PER_FETCH,
  fetchPolicy?: WatchQueryFetchPolicy,
  type: PictureOverviewType = PictureOverviewType.CUSTOM
) => {
  const filters = useMemo(() => {
    switch (textFilter) {
      case TextFilter.ONLY_PICTURES:
        return {
          and: [
            {
              or: [
                {
                  is_text: {
                    eq: false,
                  },
                },
                {
                  is_text: {
                    null: true,
                  },
                },
              ],
            },
            queryParams as PictureFiltersInput,
          ],
        };
      case TextFilter.ONLY_TEXTS:
        return {
          and: [
            {
              is_text: {
                eq: true,
              },
            },
            queryParams as PictureFiltersInput,
          ],
        };
      case TextFilter.PICTURES_AND_TEXTS:
        return queryParams as PictureFiltersInput;
    }
  }, [textFilter, queryParams]);

  const queryResult = useGetPicturesQuery({
    variables: {
      filters,
      pagination: {
        start: 0,
        limit: limit,
      },
      sortBy,
    },
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
    skip: isAllSearchActive || type !== PictureOverviewType.CUSTOM,
  });
  const customQueryResult = useGetPicturesByAllSearchQuery({
    variables: {
      ...(queryParams as GetPicturesByAllSearchQueryVariables),
      textFilter,
      pagination: {
        start: 0,
        limit: limit,
      },
    },
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
    skip: !isAllSearchActive || type !== PictureOverviewType.CUSTOM,
  });
  const mostLikedQueryResult = useGetMostLikedPicturesQuery({
    variables: {
      filters,
      pagination: {
        start: 0,
        limit: limit,
      },
    },
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
    skip: type !== PictureOverviewType.MOST_LIKED,
  });

  const allSearchResult = useMemo(
    () => ({
      ...customQueryResult,
      data: { pictures: customQueryResult.data?.findPicturesByAllSearch },
    }),
    [customQueryResult]
  );

  switch (type) {
    case PictureOverviewType.MOST_LIKED:
      return mostLikedQueryResult;
    case PictureOverviewType.CUSTOM:
    default:
      if (isAllSearchActive) {
        return allSearchResult;
      } else {
        return queryResult;
      }
  }
};

export default useGetPictures;
