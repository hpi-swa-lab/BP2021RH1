import { Person } from '@mui/icons-material';
import { Button, Chip } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPersonTagWithoutRelations, TagType } from '../../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../provider/AuthProvider';
import PictureInfoField from '../sidebar/picture-info/PictureInfoField';
import TagSelectionField from '../sidebar/picture-info/TagSelectionField';
import { useFaceTagging } from './FaceTaggingContext';

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
  const { role } = useAuth();
  const { t } = useTranslation();

  const context = useFaceTagging();
  const faceTags = context?.tags;

  const [isFaceTagging, setIsFaceTagging] = useState(false);

  const toggleFaceTagging = useCallback(() => {
    setIsFaceTagging(is => !is);
  }, []);

  const toggleHideTags = useCallback(() => {
    context?.setHideTags(is => !is);
  }, [context]);

  return (
    <>
      <PictureInfoField title={t('pictureFields.people')} icon={<Person />} type='person'>
        {context && isFaceTagging ? (
          <Stack direction='row' spacing={1} className='chip-stack'>
            {tags.map(tag => (
              <Chip
                variant={tag.id === context.activeTagId ? 'outlined' : 'filled'}
                sx={
                  faceTags?.find(ftag => ftag.personTagId === tag.id)
                    ? { background: 'gray !important' }
                    : {}
                }
                key={tag.id}
                label={tag.name}
                onClick={() => {
                  faceTags?.find(ftag => ftag.personTagId === tag.id)
                    ? null
                    : context.setActiveTagId(current => (current === tag.id ? null : tag.id));
                }}
              />
            ))}
          </Stack>
        ) : (
          <TagSelectionField
            type={TagType.PERSON}
            tags={tags}
            allTags={allTags}
            onChange={onChange}
            noContentText={t('pictureFields.noPeople')}
            createMutation={createMutation}
          />
        )}

        {context && role >= AuthRole.CURATOR && tags.length > 0 && (
          <Button
            variant='contained'
            className='!mt-5 w-full !bg-[#7e241d]'
            onClick={toggleFaceTagging}
          >
            {t('pictureFields.tag-faces')}
          </Button>
        )}
        {tags.length > 0 && (
          <Button
            variant='contained'
            className='!mt-5 w-full !bg-[#7e241d]'
            onClick={toggleHideTags}
          >
            {context?.hideTags
              ? t('pictureFields.display-facetags')
              : t('pictureFields.hide-facetags')}
          </Button>
        )}
      </PictureInfoField>
    </>
  );
};
