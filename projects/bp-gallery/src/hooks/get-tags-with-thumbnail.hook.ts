import { NUMBER_OF_PICTURES_LOADED_PER_FETCH } from './get-pictures.hook';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
  PictureFiltersInput,
} from '../graphql/APIConnector';
import { TagType } from '../types/additionalFlatTypes';
import useGenericTagEndpoints from './generic-endpoints.hook';

const useGetTagsWithThumbnail = (
  queryParams: LocationTagFiltersInput | KeywordTagFiltersInput | PersonTagFiltersInput | undefined,
  thumbnailQueryParams: PictureFiltersInput | undefined,
  isAllSearchActive: boolean,
  type: TagType,
  sortBy?: string[],
  limit: number = NUMBER_OF_PICTURES_LOADED_PER_FETCH
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
      start: 0,
      limit: limit,
      sortBy: ['name:asc'],
    },
  });

  return queryResult;
};

export default useGetTagsWithThumbnail;
