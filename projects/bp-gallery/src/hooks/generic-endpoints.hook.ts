import { useMemo } from 'react';
import {
  useCreateKeywordMutation,
  useCreateLocationMutation,
  useCreateSubKeywordMutation,
  useCreateSubLocationMutation,
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
  useUpdateKeywordAcceptanceMutation,
  useUpdateKeywordNameMutation,
  useUpdateKeywordParentMutation,
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
          createTagMutationSource: useCreateLocationMutation,
          createSubTagMutationSource: useCreateSubLocationMutation,
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
          createTagMutationSource: (dummy: any) => {
            return [dummy];
          },
          createSubTagMutationSource: (dummy: any) => {
            return [dummy];
          },
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
          updateTagParentMutationSource: useUpdateKeywordParentMutation,
          createTagMutationSource: useCreateKeywordMutation,
          createSubTagMutationSource: useCreateSubKeywordMutation,
          updateTagAcceptanceMutationSource: useUpdateKeywordAcceptanceMutation,
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
