import { Person } from '@mui/icons-material';
import { TagType } from '../../../../types/additionalFlatTypes';
import { FaceTaggingContext } from '../../../provider/AnchorTaggingContext';
import { createAnchorTaggingUI } from './AnchorTaggingUI';

export const FaceTaggingUI = createAnchorTaggingUI({
  Context: FaceTaggingContext,
  Icon: Person,
  tagType: TagType.PERSON,
  tagTypeName: 'person',
  translationNamespace: 'face-tagging',
  titleTranslationKey: 'pictureFields.people',
  noTagsTranslationKey: 'pictureFields.noPeople',
});
