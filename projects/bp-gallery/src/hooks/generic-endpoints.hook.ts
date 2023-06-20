import { noop } from 'lodash';
import { useMemo } from 'react';
import {
  useCanRunCreateKeywordTagMutation,
  useCanRunCreateLocationTagMutation,
  useCanRunCreatePersonTagMutation,
  useCanRunDeleteKeywordTagMutation,
  useCanRunDeleteLocationTagMutation,
  useCanRunDeletePersonTagMutation,
  useCanRunMergeKeywordTagsMutation,
  useCanRunMergeLocationTagsMutation,
  useCanRunMergePersonTagsMutation,
  useCanRunUpdateKeywordNameMutation,
  useCanRunUpdateKeywordSynonymsMutation,
  useCanRunUpdateKeywordVisibilityMutation,
  useCanRunUpdateLocationAcceptanceMutation,
  useCanRunUpdateLocationChildMutation,
  useCanRunUpdateLocationNameMutation,
  useCanRunUpdateLocationParentMutation,
  useCanRunUpdateLocationRootMutation,
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

const cantRun = () => {
  return { canRun: false, loading: false };
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
          canUpdateVisibilityQuery: useCanRunUpdateLocationVisibilityMutation,
          canUpdateTagParentQuery: useCanRunUpdateLocationParentMutation,
          canUpdateTagAcceptanceQuery: useCanRunUpdateLocationAcceptanceMutation,
          canUpdateTagChildQuery: useCanRunUpdateLocationChildMutation,
          canUpdateRootQuery: useCanRunUpdateLocationRootMutation,
          canMergeTagsQuery: useCanRunMergeLocationTagsMutation,
          canDeleteTagQuery: useCanRunDeleteLocationTagMutation,
          canCreateTagQuery: useCanRunCreateLocationTagMutation,
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
          canUpdateVisibilityQuery: cantRun,
          canUpdateTagParentQuery: cantRun,
          canUpdateTagAcceptanceQuery: cantRun,
          canUpdateTagChildQuery: cantRun,
          canUpdateRootQuery: cantRun,
          canMergeTagsQuery: useCanRunMergePersonTagsMutation,
          canDeleteTagQuery: useCanRunDeletePersonTagMutation,
          canCreateTagQuery: useCanRunCreatePersonTagMutation,
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
          canUpdateVisibilityQuery: useCanRunUpdateKeywordVisibilityMutation,
          canUpdateTagParentQuery: cantRun,
          canUpdateTagAcceptanceQuery: cantRun,
          canUpdateTagChildQuery: cantRun,
          canUpdateRootQuery: cantRun,
          canMergeTagsQuery: useCanRunMergeKeywordTagsMutation,
          canDeleteTagQuery: useCanRunDeleteKeywordTagMutation,
          canCreateTagQuery: useCanRunCreateKeywordTagMutation,
        };
    }
  }, [type]);
};

export default useGenericTagEndpoints;
