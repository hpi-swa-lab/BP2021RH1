import {
  GetPicturesByAllSearchQueryVariables,
  GetPicturesQuery,
  PictureFiltersInput,
  useGetPicturesByAllSearchQuery,
  useGetPicturesQuery,
} from '../graphql/APIConnector';
import { NUMBER_OF_PICTURES_LOADED_PER_FETCH } from '../components/common/picture-gallery/PictureScrollGrid';
import { AuthRole, useAuth } from '../components/provider/AuthProvider';
import { useCallback, useMemo } from 'react';

const useGetPictures = (
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] },
  isAllSearchActive: boolean,
  sortBy?: string[],
  filterOutTextsForNonCurators = true
) => {
  const queryResult = useGetPicturesQuery({
    variables: {
      filters: queryParams as PictureFiltersInput,
      pagination: {
        start: 0,
        limit: NUMBER_OF_PICTURES_LOADED_PER_FETCH,
      },
      sortBy,
    },
    notifyOnNetworkStatusChange: true,
    skip: isAllSearchActive,
  });
  const customQueryResult = useGetPicturesByAllSearchQuery({
    variables: {
      ...(queryParams as GetPicturesByAllSearchQueryVariables),
      pagination: {
        start: 0,
        limit: NUMBER_OF_PICTURES_LOADED_PER_FETCH,
      },
    },
    notifyOnNetworkStatusChange: true,
    skip: !isAllSearchActive,
  });

  const { role } = useAuth();

  const doFilterOutTexts = role < AuthRole.CURATOR && filterOutTextsForNonCurators;

  type PictureData = NonNullable<GetPicturesQuery['pictures']>['data'][number];

  const filterOutTexts = useCallback(
    (pictures: (PictureData | null | undefined)[] | null | undefined) => {
      if (!pictures) {
        return undefined;
      }
      return {
        pictures: {
          data: doFilterOutTexts
            ? pictures.filter(picture => !picture?.attributes?.is_text)
            : pictures,
        },
      };
    },
    [doFilterOutTexts]
  );

  const filteredAllSearchData = useMemo(
    () => filterOutTexts(customQueryResult.data?.findPicturesByAllSearch),
    [filterOutTexts, customQueryResult]
  );

  const filteredQueryData = useMemo(
    () => filterOutTexts(queryResult.data?.pictures?.data),
    [filterOutTexts, queryResult]
  );

  if (isAllSearchActive) {
    return {
      ...customQueryResult,
      data: filteredAllSearchData,
    };
  } else {
    return {
      ...queryResult,
      data: filteredQueryData,
    };
  }
};

export default useGetPictures;
