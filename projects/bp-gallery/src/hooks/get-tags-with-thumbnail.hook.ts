import { WatchQueryFetchPolicy } from '@apollo/client';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
  PictureFiltersInput,
} from '../graphql/APIConnector';
import { TagType } from '../types/additionalFlatTypes';
import useGenericTagEndpoints from './generic-endpoints.hook';
import { NUMBER_OF_PICTURES_LOADED_PER_FETCH } from './get-pictures.hook';

const useGetTagsWithThumbnail = (
  queryParams: LocationTagFiltersInput | KeywordTagFiltersInput | PersonTagFiltersInput | undefined,
  thumbnailQueryParams: PictureFiltersInput | undefined,
  type: TagType,
  sortBy: string[] = ['name:asc'],
  limit: number = NUMBER_OF_PICTURES_LOADED_PER_FETCH,
  fetchPolicy?: WatchQueryFetchPolicy,
  noLimit?: boolean
) => {
  const { tagsWithThumbnailQuery } = useGenericTagEndpoints(type);

  const queryResult = tagsWithThumbnailQuery({
    variables: {
      filters: queryParams,
      thumbnailFilters: {
        and: [
          thumbnailQueryParams,
          { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] },
        ],
      } as PictureFiltersInput,
      pagination: {
        start: 0,
        limit: noLimit ? undefined : limit,
      },
      sortBy,
    },
    fetchPolicy,
  });

  return queryResult;
};

export default useGetTagsWithThumbnail;
