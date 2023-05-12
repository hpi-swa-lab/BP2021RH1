import { useMemo } from 'react';
import {
  useCreateKeywordTagMutation,
  useCreateLocationTagMutation,
  useCreatePersonTagMutation,
  useDeleteKeywordTagMutation,
  useDeleteLocationTagMutation,
  useDeletePersonTagMutation,
  useGetAllKeywordTagsQuery,
  useGetAllLocationTagsQuery,
  useGetAllPersonTagsQuery,
  useGetKeywordTagsWithThumbnailQuery,
  useGetLocationTagsWithThumbnailQuery,
  useGetPersonTagsWithThumbnailQuery,
  useGetPicturesForLocationQuery,
  useMergeKeywordTagsMutation,
  useMergeLocationTagsMutation,
  useMergePersonTagsMutation,
  useUpdateKeywordNameMutation,
  useUpdateKeywordSynonymsMutation,
  useUpdateKeywordVisibilityMutation,
  useUpdateLocationAcceptanceMutation,
  useUpdateLocationChildMutation,
  useUpdateLocationNameMutation,
  useUpdateLocationParentMutation,
  useUpdateLocationRootMutation,
  useUpdateLocationSynonymsMutation,
  useUpdateLocationVisibilityMutation,
  useUpdatePersonNameMutation,
  useUpdatePersonSynonymsMutation,
} from '../graphql/APIConnector';
import { TagType } from '../types/additionalFlatTypes';

const useGenericTagEndpoints = (type: TagType) => {
  return useMemo(() => {
    switch (type) {
      case TagType.LOCATION:
        return {
          allTagsQuery: useGetAllLocationTagsQuery,
          tagsWithThumbnailQuery: useGetLocationTagsWithThumbnailQuery,
          updateTagNameMutationSource: useUpdateLocationNameMutation,
          updateSynonymsMutationSource: useUpdateLocationSynonymsMutation,
          mergeTagsMutationSource: useMergeLocationTagsMutation,
          deleteTagMutationSource: useDeleteLocationTagMutation,
          updateVisibilityMutationSource: useUpdateLocationVisibilityMutation,
          updateTagParentMutationSource: useUpdateLocationParentMutation,
          createTagMutationSource: useCreateLocationTagMutation,
          updateTagAcceptanceMutationSource: useUpdateLocationAcceptanceMutation,
          updateTagChildMutationSource: useUpdateLocationChildMutation,
          tagPictures: useGetPicturesForLocationQuery,
          updateRootMutationSource: useUpdateLocationRootMutation,
        };
      case TagType.PERSON:
        return {
          allTagsQuery: useGetAllPersonTagsQuery,
          tagsWithThumbnailQuery: useGetPersonTagsWithThumbnailQuery,
          updateTagNameMutationSource: useUpdatePersonNameMutation,
          updateSynonymsMutationSource: useUpdatePersonSynonymsMutation,
          mergeTagsMutationSource: useMergePersonTagsMutation,
          deleteTagMutationSource: useDeletePersonTagMutation,
          updateVisibilityMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagParentMutationSource: (dummy: any) => {
            return [dummy];
          },
          createTagMutationSource: useCreatePersonTagMutation,
          updateTagAcceptanceMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagChildMutationSource: (dummy: any) => {
            return [dummy];
          },
          tagPictures: useGetPicturesForLocationQuery,
          updateRootMutationSource: useUpdateLocationRootMutation,
        };
      case TagType.KEYWORD:
      default:
        return {
          allTagsQuery: useGetAllKeywordTagsQuery,
          tagsWithThumbnailQuery: useGetKeywordTagsWithThumbnailQuery,
          updateTagNameMutationSource: useUpdateKeywordNameMutation,
          updateSynonymsMutationSource: useUpdateKeywordSynonymsMutation,
          mergeTagsMutationSource: useMergeKeywordTagsMutation,
          deleteTagMutationSource: useDeleteKeywordTagMutation,
          updateVisibilityMutationSource: useUpdateKeywordVisibilityMutation,
          updateTagParentMutationSource: (dummy: any) => {
            return [dummy];
          },
          createTagMutationSource: useCreateKeywordTagMutation,
          updateTagAcceptanceMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagChildMutationSource: (dummy: any) => {
            return [dummy];
          },
          tagPictures: useGetPicturesForLocationQuery,
          updateRootMutationSource: useUpdateLocationRootMutation,
        };
    }
  }, [type]);
};

export default useGenericTagEndpoints;
