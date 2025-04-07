import { FaceTaggingContext } from '../../../provider/AnchorTaggingContext';
import { createAnchorTags } from './AnchorTags';
import { FaceTag } from './FaceTag';

export const FaceTags = createAnchorTags({
  TaggingContext: FaceTaggingContext,
  AnchorTag: FaceTag,
});
