import { useMemo } from 'react';
import {
  useGetAllKeywordTagsQuery,
  useGetAllLocationTagsQuery,
  useGetAllPersonTagsQuery,
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
          tagQuery: useGetAllLocationTagsQuery,
          updateTagNameMutationSource: useUpdateLocationNameMutation,
          updateSynonymsMutationSource: useUpdateLocationSynonymsMutation,
        };
      case 'people':
        return {
          tagQuery: useGetAllPersonTagsQuery,
          updateTagNameMutationSource: useUpdatePersonNameMutation,
          updateSynonymsMutationSource: useUpdatePersonSynonymsMutation,
        };
      case 'keywords':
      default:
        return {
          tagQuery: useGetAllKeywordTagsQuery,
          updateTagNameMutationSource: useUpdateKeywordNameMutation,
          updateSynonymsMutationSource: useUpdateKeywordSynonymsMutation,
        };
    }
  }, [type]);
};

export default useGenericTagEndpoints;
