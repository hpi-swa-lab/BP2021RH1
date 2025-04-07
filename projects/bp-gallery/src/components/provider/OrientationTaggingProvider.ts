import {
  useCanRunCreateOrientationTagMutation,
  useCanRunMultipleDeleteOrientationTagMutations,
  useCreateOrientationTagMutation,
  useDeleteOrientationTagMutation,
  useGetLocationTagQuery,
  useGetOrientationTagsQuery,
  useUpdateOrientationTagDirectionMutation,
} from '../../graphql/APIConnector';
import { OrientationTaggingContext } from './AnchorTaggingContext';
import { createAnchorTaggingProvider } from './AnchorTaggingProvider';

export const OrientationTaggingProvider = createAnchorTaggingProvider({
  TaggingContext: OrientationTaggingContext,
  anchorTagsKey: 'orientationTags',
  tagKey: 'location_tag',
  tagIdKey: 'locationTagId',
  getAnchorTagsQueryName: 'getOrientationTags',
  useGetAnchorTagsQuery: useGetOrientationTagsQuery,
  useGetTagQuery: useGetLocationTagQuery,
  useCreateAnchorTagMutation: useCreateOrientationTagMutation,
  useCanRunCreateAnchorTagMutation: useCanRunCreateOrientationTagMutation,
  useDeleteAnchorTagMutation: useDeleteOrientationTagMutation,
  useCanRunMultipleDeleteAnchorTagMutations: useCanRunMultipleDeleteOrientationTagMutations,
  useUpdateAnchorTagDirectionMutation: useUpdateOrientationTagDirectionMutation,
});
