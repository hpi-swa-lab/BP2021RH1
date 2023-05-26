import { useMemo } from 'react';
import { AuthRole, useAuth } from '../components/provider/AuthProvider';
import {
  GetPicturesByAllSearchQueryVariables,
  PictureFiltersInput,
  useGetMostLikedPicturesQuery,
  useGetPicturesByAllSearchQuery,
  useGetPicturesQuery,
} from '../graphql/APIConnector';
import { WatchQueryFetchPolicy } from '@apollo/client';
import { PictureOverviewType } from '../types/additionalFlatTypes';

export const NUMBER_OF_PICTURES_LOADED_PER_FETCH = 100;

const useGetPictures = (
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] },
  isAllSearchActive: boolean,
  sortBy?: string[],
  filterOutTextsForNonCurators = true,
  limit: number = NUMBER_OF_PICTURES_LOADED_PER_FETCH,
  fetchPolicy?: WatchQueryFetchPolicy,
  type: PictureOverviewType = PictureOverviewType.CUSTOM
) => {
  const { role } = useAuth();

  const filterOutTexts = role < AuthRole.CURATOR && filterOutTextsForNonCurators;

  const filters = useMemo(() => {
    return filterOutTexts
      ? {
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
        }
      : (queryParams as PictureFiltersInput);
  }, [filterOutTexts, queryParams]);
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
      filterOutTexts,
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
