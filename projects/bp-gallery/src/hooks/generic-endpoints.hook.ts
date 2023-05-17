import { useMemo } from 'react';
import {
  useCanRunDeleteKeywordTagMutation,
  useCanRunDeleteLocationTagMutation,
  useCanRunDeletePersonTagMutation,
  useCanRunMergeKeywordTagsMutation,
  useCanRunMergeLocationTagsMutation,
  useCanRunMergePersonTagsMutation,
  useCanRunUpdateKeywordNameMutation,
  useCanRunUpdateKeywordSynonymsMutation,
  useCanRunUpdateKeywordVisibilityMutation,
  useCanRunUpdateLocationNameMutation,
  useCanRunUpdateLocationSynonymsMutation,
  useCanRunUpdateLocationVisibilityMutation,
  useCanRunUpdatePersonNameMutation,
  useCanRunUpdatePersonSynonymsMutation,
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
  useUpdateKeywordVisibilityMutation,
  useUpdateLocationNameMutation,
  useUpdateLocationSynonymsMutation,
  useUpdateLocationVisibilityMutation,
  useUpdatePersonNameMutation,
  useUpdatePersonSynonymsMutation,
} from '../graphql/APIConnector';
import { TagType } from '../types/additionalFlatTypes';
import {
  useCanUseKeywordTagTableView,
  useCanUseLocationTagTableView,
  useCanUsePersonTagTableView,
} from './can-do-hooks';

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
          canUseTagTableViewQuery: useCanUseLocationTagTableView,
          canUpdateTagNameQuery: useCanRunUpdateLocationNameMutation,
          canUpdateSynonymsQuery: useCanRunUpdateLocationSynonymsMutation,
          canMergeTagsQuery: useCanRunMergeLocationTagsMutation,
          canDeleteTagQuery: useCanRunDeleteLocationTagMutation,
          canUpdateVisibilityQuery: useCanRunUpdateLocationVisibilityMutation,
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
          canUseTagTableViewQuery: useCanUsePersonTagTableView,
          canUpdateTagNameQuery: useCanRunUpdatePersonNameMutation,
          canUpdateSynonymsQuery: useCanRunUpdatePersonSynonymsMutation,
          canMergeTagsQuery: useCanRunMergePersonTagsMutation,
          canDeleteTagQuery: useCanRunDeletePersonTagMutation,
          canUpdateVisibilityQuery: () => {
            return { canRun: false, loading: false };
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
          updateVisibilityMutationSource: useUpdateKeywordVisibilityMutation,
          canUseTagTableViewQuery: useCanUseKeywordTagTableView,
          canUpdateTagNameQuery: useCanRunUpdateKeywordNameMutation,
          canUpdateSynonymsQuery: useCanRunUpdateKeywordSynonymsMutation,
          canMergeTagsQuery: useCanRunMergeKeywordTagsMutation,
          canDeleteTagQuery: useCanRunDeleteKeywordTagMutation,
          canUpdateVisibilityQuery: useCanRunUpdateKeywordVisibilityMutation,
        };
    }
  }, [type]);
};

export default useGenericTagEndpoints;
