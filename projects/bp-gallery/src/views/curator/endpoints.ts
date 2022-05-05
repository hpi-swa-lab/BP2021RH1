import { useMemo } from 'react';
import {
  useDeleteKeywordTagMutation,
  useDeleteLocationTagMutation,
  useDeletePersonTagMutation,
  useGetAllKeywordTagsQuery,
  useGetAllLocationTagsQuery,
  useGetAllPersonTagsQuery,
  useMergeKeywordTagsMutation,
  useMergeLocationTagsMutation,
  useMergePersonTagsMutation,
  useUpdateKeywordNameMutation,
  useUpdateKeywordSynonymsMutation,
  useUpdateLocationNameMutation,
  useUpdateLocationSynonymsMutation,
  useUpdatePersonNameMutation,
  useUpdatePersonSynonymsMutation,
} from '../../graphql/APIConnector';

const useGenericTagEndpoints = (type: string) => {
  return useMemo(() => {
    switch (type) {
      case 'locations':
        return {
          allTagsQuery: useGetAllLocationTagsQuery,
          updateTagNameMutationSource: useUpdateLocationNameMutation,
          updateSynonymsMutationSource: useUpdateLocationSynonymsMutation,
          mergeTagsMutationSource: useMergeLocationTagsMutation,
          deleteTagMutationSource: useDeleteLocationTagMutation,
        };
      case 'people':
        return {
          allTagsQuery: useGetAllPersonTagsQuery,
          updateTagNameMutationSource: useUpdatePersonNameMutation,
          updateSynonymsMutationSource: useUpdatePersonSynonymsMutation,
          mergeTagsMutationSource: useMergePersonTagsMutation,
          deleteTagMutationSource: useDeletePersonTagMutation,
        };
      case 'keywords':
      default:
        return {
          allTagsQuery: useGetAllKeywordTagsQuery,
          updateTagNameMutationSource: useUpdateKeywordNameMutation,
          updateSynonymsMutationSource: useUpdateKeywordSynonymsMutation,
          mergeTagsMutationSource: useMergeKeywordTagsMutation,
          deleteTagMutationSource: useDeleteKeywordTagMutation,
        };
    }
  }, [type]);
};

export default useGenericTagEndpoints;
