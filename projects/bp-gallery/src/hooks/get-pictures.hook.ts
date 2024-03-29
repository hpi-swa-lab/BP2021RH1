import { WatchQueryFetchPolicy } from '@apollo/client';
import { KeyArgsFunction } from '@apollo/client/cache/inmemory/policies';
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

type IdArray = string[];

export type QueryParams =
  | PictureFiltersInput
  | IdArray
  | { searchTerms: string[]; searchTimes: string[][] };

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
    const innerFilters =
      queryParams instanceof Array
        ? createIdArrayFilter(queryParams, 0, limit)
        : (queryParams as PictureFiltersInput);
    return wrapQueryParamsWithTextFilter(textFilter, innerFilters);
  }, [textFilter, queryParams, limit]);

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

const fullIdArray = Symbol('fullIdArray');

// Treat picture queries as the same query, as long as the filters clause is equal or
// they are part of the same multi-part idArray query.
// Queries which only differ in other fields (e.g. the pagination fields 'start' or 'limit')
// get treated as one query and the results get merged.
export const picturesKeyArgsFunction: KeyArgsFunction = args => {
  if (!args) {
    return undefined;
  }
  if (isIdArrayFilters(args.filters)) {
    return JSON.stringify(args.filters[fullIdArray]);
  }
  return ['filters'];
};

export const isIdArrayFilters = (filters: unknown) => {
  return typeof filters === 'object' && !!filters && fullIdArray in filters;
};

export const createIdArrayFilter = (idArray: IdArray, start: number, limit: number) => {
  return {
    [fullIdArray]: idArray,
    id: {
      in: idArray.slice(start, start + limit),
    },
  } as PictureFiltersInput;
};

export const wrapQueryParamsWithTextFilter = (
  textFilter: TextFilter,
  innerFilters: PictureFiltersInput
) => {
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
          innerFilters,
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
          innerFilters,
        ],
      };
    case TextFilter.PICTURES_AND_TEXTS:
      return innerFilters;
  }
};
