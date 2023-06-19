import { noop } from 'lodash';
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
import {
  useCanUseKeywordTagTableView,
  useCanUseLocationTagTableView,
  useCanUsePersonTagTableView,
} from './can-do-hooks';

const dummy = (_?: unknown) => {
  return [noop];
};

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
          tagPictures: () => {
            return { data: undefined };
          },
          updateTagNameMutationSource: useUpdatePersonNameMutation,
          updateSynonymsMutationSource: useUpdatePersonSynonymsMutation,
          updateVisibilityMutationSource: dummy,
          updateTagParentMutationSource: dummy,
          updateTagAcceptanceMutationSource: dummy,
          updateTagChildMutationSource: dummy,
          updateRootMutationSource: dummy,
          mergeTagsMutationSource: useMergePersonTagsMutation,
          deleteTagMutationSource: useDeletePersonTagMutation,
          createTagMutationSource: useCreatePersonTagMutation,
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
          tagPictures: () => {
            return { data: undefined };
          },
          updateTagNameMutationSource: useUpdateKeywordNameMutation,
          updateSynonymsMutationSource: useUpdateKeywordSynonymsMutation,
          updateVisibilityMutationSource: useUpdateKeywordVisibilityMutation,
          updateTagParentMutationSource: dummy,
          updateTagAcceptanceMutationSource: dummy,
          updateTagChildMutationSource: dummy,
          updateRootMutationSource: dummy,
          mergeTagsMutationSource: useMergeKeywordTagsMutation,
          deleteTagMutationSource: useDeleteKeywordTagMutation,
          createTagMutationSource: useCreateKeywordTagMutation,
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
