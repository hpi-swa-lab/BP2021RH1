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
  INCLUDE_PICTURES = 'INCLUDE_PICTURES',
  INCLUDE_PDFS = 'INCLUDE_PDFS',
  INCLUDE_TEXTS = 'INCLUDE_TEXTS',
}

const useGetPictures = (
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] },
  isAllSearchActive: boolean,
  sortBy?: string[],
  textFilter = [TextFilter.INCLUDE_PICTURES],
  limit: number = NUMBER_OF_PICTURES_LOADED_PER_FETCH,
  fetchPolicy?: WatchQueryFetchPolicy,
  type: PictureOverviewType = PictureOverviewType.CUSTOM
) => {
  const textQuery = useMemo(
    () => ({
      is_text: {
        eq: true,
      },
    }),
    []
  );

  const pdfQuery: PictureFiltersInput = useMemo(
    () => ({
      is_pdf: {
        eq: true,
      },
    }),
    []
  );

  const picturesQuery = useMemo(
    () =>
      ({
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
          {
            or: [
              {
                is_pdf: {
                  eq: false,
                },
              },
              {
                is_pdf: {
                  null: true,
                },
              },
            ],
          },
        ],
      } as PictureFiltersInput),
    []
  );

  const filters = useMemo(() => {
    const filter: PictureFiltersInput = { and: [{ or: [] }, queryParams as PictureFiltersInput] };
    if (textFilter.includes(TextFilter.INCLUDE_PICTURES)) filter.and?.[0]?.or?.push(picturesQuery);
    if (textFilter.includes(TextFilter.INCLUDE_TEXTS)) filter.and?.[0]?.or?.push(textQuery);
    if (textFilter.includes(TextFilter.INCLUDE_PDFS)) filter.and?.[0]?.or?.push(pdfQuery);
    return filter;
  }, [queryParams, textFilter, picturesQuery, textQuery, pdfQuery]);

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
