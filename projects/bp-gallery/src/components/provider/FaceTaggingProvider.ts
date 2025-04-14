import {
  useCanRunCreateFaceTagMutation,
  useCanRunMultipleDeleteFaceTagMutations,
  useCreateFaceTagMutation,
  useDeleteFaceTagMutation,
  useGetFaceTagsQuery,
  useGetPersonTagQuery,
  useUpdateFaceTagDirectionMutation,
} from '../../graphql/APIConnector';
import { FaceTaggingContext } from './AnchorTaggingContext';
import { createAnchorTaggingProvider } from './AnchorTaggingProvider';

export const FaceTaggingProvider = createAnchorTaggingProvider({
  TaggingContext: FaceTaggingContext,
  anchorTagsKey: 'faceTags',
  tagKey: 'person_tag',
  tagIdKey: 'personTagId',
  getAnchorTagsQueryName: 'getFaceTags',
  useGetAnchorTagsQuery: useGetFaceTagsQuery,
  useGetTagQuery: useGetPersonTagQuery,
  useCreateAnchorTagMutation: useCreateFaceTagMutation,
  useCanRunCreateAnchorTagMutation: useCanRunCreateFaceTagMutation,
  useDeleteAnchorTagMutation: useDeleteFaceTagMutation,
  useCanRunMultipleDeleteAnchorTagMutations: useCanRunMultipleDeleteFaceTagMutations,
  useUpdateAnchorTagDirectionMutation: useUpdateFaceTagDirectionMutation,
});
