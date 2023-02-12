import {
  GetPicturesByAllSearchQueryVariables,
  PictureFiltersInput,
  useGetPicturesByAllSearchQuery,
  useGetPicturesQuery,
} from '../graphql/APIConnector';
import { AuthRole, useAuth } from '../components/provider/AuthProvider';
import { useMemo } from 'react';

export const NUMBER_OF_PICTURES_LOADED_PER_FETCH = 100;

const useGetPictures = (
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] },
  isAllSearchActive: boolean,
  sortBy?: string[],
  limit: number = NUMBER_OF_PICTURES_LOADED_PER_FETCH,
  filterOutTextsForNonCurators = true
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
    notifyOnNetworkStatusChange: true,
    skip: isAllSearchActive,
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
    notifyOnNetworkStatusChange: true,
    skip: !isAllSearchActive,
  });

  const allSearchResult = useMemo(
    () => ({
      ...customQueryResult,
      data: { pictures: customQueryResult.data?.findPicturesByAllSearch },
    }),
    [customQueryResult]
  );

  if (isAllSearchActive) {
    return allSearchResult;
  } else {
    return queryResult;
  }
};

export default useGetPictures;
