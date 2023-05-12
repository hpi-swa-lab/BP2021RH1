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
          tagPictures: useGetPicturesForLocationQuery,
          updateTagNameMutationSource: useUpdateLocationNameMutation,
          updateSynonymsMutationSource: useUpdateLocationSynonymsMutation,
          updateVisibilityMutationSource: useUpdateLocationVisibilityMutation,
          updateTagParentMutationSource: useUpdateLocationParentMutation,
          updateTagAcceptanceMutationSource: useUpdateLocationAcceptanceMutation,
          updateTagChildMutationSource: useUpdateLocationChildMutation,
          updateRootMutationSource: useUpdateLocationRootMutation,
          mergeTagsMutationSource: useMergeLocationTagsMutation,
          deleteTagMutationSource: useDeleteLocationTagMutation,
          createTagMutationSource: useCreateLocationTagMutation,
        };
      case TagType.PERSON:
        return {
          allTagsQuery: useGetAllPersonTagsQuery,
          tagsWithThumbnailQuery: useGetPersonTagsWithThumbnailQuery,
          tagPictures: () => {
            return { data: undefined };
          },
          updateTagNameMutationSource: useUpdatePersonNameMutation,
          updateSynonymsMutationSource: useUpdatePersonSynonymsMutation,
          updateVisibilityMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagParentMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagAcceptanceMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagChildMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateRootMutationSource: (dummy: any) => {
            return [dummy];
          },
          mergeTagsMutationSource: useMergePersonTagsMutation,
          deleteTagMutationSource: useDeletePersonTagMutation,
          createTagMutationSource: useCreatePersonTagMutation,
        };
      case TagType.KEYWORD:
      default:
        return {
          allTagsQuery: useGetAllKeywordTagsQuery,
          tagsWithThumbnailQuery: useGetKeywordTagsWithThumbnailQuery,
          tagPictures: () => {
            return { data: undefined };
          },
          updateTagNameMutationSource: useUpdateKeywordNameMutation,
          updateSynonymsMutationSource: useUpdateKeywordSynonymsMutation,
          updateVisibilityMutationSource: useUpdateKeywordVisibilityMutation,
          updateTagParentMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagAcceptanceMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateTagChildMutationSource: (dummy: any) => {
            return [dummy];
          },
          updateRootMutationSource: (dummy: any) => {
            return [dummy];
          },
          mergeTagsMutationSource: useMergeKeywordTagsMutation,
          deleteTagMutationSource: useDeleteKeywordTagMutation,
          createTagMutationSource: useCreateKeywordTagMutation,
        };
    }
  }, [type]);
};

export default useGenericTagEndpoints;
