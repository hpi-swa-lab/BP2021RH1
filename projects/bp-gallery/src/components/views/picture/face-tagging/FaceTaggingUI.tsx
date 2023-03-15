import { Person } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FlatPersonTagWithoutRelations, TagType } from '../../../../types/additionalFlatTypes';
import PictureInfoField from '../sidebar/picture-info/PictureInfoField';
import TagSelectionField from '../sidebar/picture-info/TagSelectionField';

export const FaceTaggingUI = ({
  tags,
  allTags,
  onChange,
  createMutation,
}: {
  tags: FlatPersonTagWithoutRelations[];
  allTags: FlatPersonTagWithoutRelations[];
  onChange: (tags: FlatPersonTagWithoutRelations[]) => void;
  createMutation: (attr: any) => Promise<any>;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <PictureInfoField title={t('pictureFields.people')} icon={<Person />} type='person'>
        <TagSelectionField
          type={TagType.PERSON}
          tags={tags}
          allTags={allTags}
          onChange={onChange}
          noContentText={t('pictureFields.noPeople')}
          createMutation={createMutation}
        />
      </PictureInfoField>
    </>
  );
};
