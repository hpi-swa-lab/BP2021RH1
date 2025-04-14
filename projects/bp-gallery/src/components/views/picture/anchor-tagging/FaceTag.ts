import {
  useCanRunDeleteFaceTagMutation,
  useCanRunUpdateFaceTagDirectionMutation,
} from '../../../../graphql/APIConnector';
import { FaceTaggingContext } from '../../../provider/AnchorTaggingContext';
import { createAnchorTag } from './AnchorTag';

export const FaceTag = createAnchorTag({
  anchorTagKey: 'faceTag',
  className: 'facetag',
  TaggingContext: FaceTaggingContext,
  useCanRunDeleteAnchorTagMutation: useCanRunDeleteFaceTagMutation,
  useCanRunUpdateAnchorTagDirectionMutation: useCanRunUpdateFaceTagDirectionMutation,
});
