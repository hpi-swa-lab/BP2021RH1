import { Person } from '@mui/icons-material';
import { Button, Chip } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFaceTagging } from '../../../../hooks/context-hooks';
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
  onChange?: (tags: FlatPersonTagWithoutRelations[]) => void;
  createMutation?: (attr: any) => Promise<any>;
}) => {
  const { t } = useTranslation();

  const context = useFaceTagging();
  const faceTags = context?.tags;

  const isFaceTagging = context?.isFaceTagging;
  const setIsFaceTagging = context?.setIsFaceTagging;

  const toggleFaceTagging = useCallback(() => {
    if (!setIsFaceTagging) {
      return;
    }
    setIsFaceTagging(is => !is);
  }, [setIsFaceTagging]);

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
                title={t('pictureFields.face-tagging-explanation')}
                className='hover:brightness-150 !transition'
                onClick={() => {
                  context.canCreateTag && faceTags?.find(ftag => ftag.personTagId === tag.id)
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

        {context && context.canFaceTag && (tags.length > 0 || isFaceTagging) && (
          <Button
            variant='contained'
            className='!mt-5 w-full !bg-[#7e241d]'
            onClick={toggleFaceTagging}
          >
            {isFaceTagging ? t('pictureFields.edit-faces') : t('pictureFields.tag-faces')}
          </Button>
        )}
        {faceTags !== undefined && faceTags.length > 0 && !isFaceTagging && (
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
