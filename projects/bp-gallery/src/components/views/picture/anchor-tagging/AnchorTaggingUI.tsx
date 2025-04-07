import { Button, Chip } from '@mui/material';
import { Stack } from '@mui/system';
import { ComponentType, Context, useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatTagWithoutRelations, TagType } from '../../../../types/additionalFlatTypes';
import { AnchorTagging } from '../../../provider/AnchorTaggingContext';
import { PictureViewContext } from '../PictureView';
import PictureInfoField from '../sidebar/picture-info/PictureInfoField';
import TagSelectionField from '../sidebar/picture-info/TagSelectionField';

export const createAnchorTaggingUI = ({
  Context,
  Icon,
  tagType,
  tagTypeName,
  translationNamespace,
  titleTranslationKey,
  noTagsTranslationKey,
}: {
  Context: Context<AnchorTagging | null>;
  Icon: ComponentType;
  tagType: TagType;
  tagTypeName: string;
  translationNamespace: string;
  titleTranslationKey: string;
  noTagsTranslationKey: string;
}) => {
  const AnchorTaggingUI = ({
    tags,
    allTags,
    onChange,
    createMutation,
  }: {
    tags: FlatTagWithoutRelations[];
    allTags: FlatTagWithoutRelations[];
    onChange?: (tags: FlatTagWithoutRelations[]) => void;
    createMutation?: (attr: any) => Promise<any>;
  }) => {
    const { t } = useTranslation();

    const context = useContext(Context);
    const anchorTags = context?.tags;

    const isAnchorTagging = context?.isAnchorTagging;
    const setIsAnchorTagging = context?.setIsAnchorTagging;

    const toggleAnchorTagging = useCallback(() => {
      if (!setIsAnchorTagging) {
        return;
      }
      setIsAnchorTagging(is => !is);
    }, [setIsAnchorTagging]);

    const toggleHideTags = useCallback(() => {
      context?.setHideTags(is => !is);
    }, [context]);

    const { setSideBarOpen } = useContext(PictureViewContext);

    useEffect(() => {
      if (context?.canAnchorTag) {
        setSideBarOpen?.(true);
      }
    }, [context?.canAnchorTag, setSideBarOpen]);

    return (
      <>
        <PictureInfoField title={t(titleTranslationKey)} icon={<Icon />} type={tagTypeName}>
          {context && isAnchorTagging ? (
            <Stack direction='row' spacing={1} className='chip-stack'>
              {tags.map(tag => (
                <Chip
                  variant={tag.id === context.activeTagId ? 'outlined' : 'filled'}
                  sx={
                    anchorTags?.find(anchorTag => anchorTag.tagId === tag.id)
                      ? { background: 'gray !important' }
                      : {}
                  }
                  key={tag.id}
                  label={tag.name}
                  title={t(`pictureFields.${translationNamespace}.explanation`)}
                  className='hover:brightness-150 !transition'
                  onClick={() => {
                    context.canCreateTag &&
                    anchorTags?.find(anchorTag => anchorTag.tagId === tag.id)
                      ? null
                      : context.setActiveTagId(current => (current === tag.id ? null : tag.id));
                  }}
                />
              ))}
            </Stack>
          ) : (
            <TagSelectionField
              type={tagType}
              tags={tags}
              allTags={allTags}
              onChange={onChange}
              noContentText={t(noTagsTranslationKey)}
              createMutation={createMutation}
            />
          )}

          {context?.canAnchorTag && (tags.length > 0 || isAnchorTagging) && (
            <Button
              variant='contained'
              color='primary'
              fullWidth
              className='!mt-5'
              onClick={toggleAnchorTagging}
            >
              {isAnchorTagging
                ? t(`pictureFields.${translationNamespace}.edit`)
                : t(`pictureFields.${translationNamespace}.tag`)}
            </Button>
          )}
          {anchorTags !== undefined && anchorTags.length > 0 && !isAnchorTagging && (
            <Button
              variant='contained'
              color='primary'
              fullWidth
              className='!mt-5'
              onClick={toggleHideTags}
            >
              {context?.hideTags
                ? t(`pictureFields.${translationNamespace}.display`)
                : t(`pictureFields.${translationNamespace}.hide`)}
            </Button>
          )}
        </PictureInfoField>
      </>
    );
  };
  return AnchorTaggingUI;
};
