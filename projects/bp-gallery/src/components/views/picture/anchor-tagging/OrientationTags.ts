import { OrientationTaggingContext } from '../../../provider/AnchorTaggingContext';
import { createAnchorTags } from './AnchorTags';
import { OrientationTag } from './OrientationTag';

export const OrientationTags = createAnchorTags({
  TaggingContext: OrientationTaggingContext,
  AnchorTag: OrientationTag,
});
