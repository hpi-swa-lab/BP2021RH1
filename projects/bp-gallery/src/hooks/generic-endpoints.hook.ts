import { useMemo } from 'react';
import {
  useDeleteKeywordTagMutation,
  useDeleteLocationTagMutation,
  useDeletePersonTagMutation,
  useGetAllKeywordTagsQuery,
  useGetAllLocationTagsQuery,
  useGetAllPersonTagsQuery,
  useGetKeywordTagsWithThumbnailQuery,
  useGetLocationTagsWithThumbnailQuery,
  useGetPersonTagsWithThumbnailQuery,
  useMergeKeywordTagsMutation,
  useMergeLocationTagsMutation,
  useMergePersonTagsMutation,
  useUpdateKeywordNameMutation,
  useUpdateKeywordSynonymsMutation,
  useUpdateLocationNameMutation,
  useUpdateLocationSynonymsMutation,
  useUpdatePersonNameMutation,
  useUpdatePersonSynonymsMutation,
  useUpdateRootKeywordMutation,
} from '../graphql/APIConnector';
import { TagType } from '../types/additionalFlatTypes';
import { useUpdateRootLocationMutation } from './../graphql/APIConnector';

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
          updateRootMutationSource: useUpdateRootLocationMutation,
        };
      case TagType.PERSON:
        return {
          allTagsQuery: useGetAllPersonTagsQuery,
          tagsWithThumbnailQuery: useGetPersonTagsWithThumbnailQuery,
          updateTagNameMutationSource: useUpdatePersonNameMutation,
          updateSynonymsMutationSource: useUpdatePersonSynonymsMutation,
          mergeTagsMutationSource: useMergePersonTagsMutation,
          deleteTagMutationSource: useDeletePersonTagMutation,
          updateRootMutationSource: (dummy: any) => {
            return [dummy];
          },
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
          updateRootMutationSource: useUpdateRootKeywordMutation,
        };
    }
  }, [type]);
};

export default useGenericTagEndpoints;
