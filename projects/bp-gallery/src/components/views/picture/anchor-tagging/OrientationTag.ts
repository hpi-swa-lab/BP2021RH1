import {
  useCanRunDeleteOrientationTagMutation,
  useCanRunUpdateOrientationTagDirectionMutation,
} from '../../../../graphql/APIConnector';
import { OrientationTaggingContext } from '../../../provider/AnchorTaggingContext';
import { createAnchorTag } from './AnchorTag';

export const OrientationTag = createAnchorTag({
  anchorTagKey: 'orientationTag',
  className: 'orientationtag',
  TaggingContext: OrientationTaggingContext,
  useCanRunDeleteAnchorTagMutation: useCanRunDeleteOrientationTagMutation,
  useCanRunUpdateAnchorTagDirectionMutation: useCanRunUpdateOrientationTagDirectionMutation,
});
