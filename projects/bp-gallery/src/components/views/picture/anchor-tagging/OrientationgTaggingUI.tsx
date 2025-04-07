import { Button } from '@mui/material';
import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrientationTagging } from '../../../../hooks/context-hooks';
import { FlatTag } from '../../../../types/additionalFlatTypes';
import CheckboxButton from '../../../common/CheckboxButton';
import { DialogPreset, useDialog } from '../../../provider/DialogProvider';
import { PictureViewContext } from '../PictureView';

export const OrientationTaggingUI = () => {
  const { t } = useTranslation();

  const context = useOrientationTagging();
  const orientationTags = context?.tags;

  const isOrientationTagging = context?.isAnchorTagging;
  const setIsOrientationTagging = context?.setIsAnchorTagging;

  const toggleHideTags = useCallback(() => {
    context?.setHideTags(is => !is);
  }, [context]);

  const dialog = useDialog();

  const canCreate = context?.canCreateTag;
  const addOrientationTag = useCallback(async () => {
    const tag: FlatTag | undefined = await dialog({
      title: t('pictureFields.add-orientation-tag'),
      preset: DialogPreset.SELECT_OR_CREATE_LOCATION,
    });
    if (!tag) {
      return;
    }
    context?.setActiveTagId(tag.id);
  }, [dialog, t, context]);

  const cancelAddOrientationTag = useCallback(() => {
    context?.setActiveTagId(null);
  }, [context]);

  const { setSideBarOpen } = useContext(PictureViewContext);

  useEffect(() => {
    if (context?.canAnchorTag) {
      setSideBarOpen?.(true);
    }
  }, [context?.canAnchorTag, setSideBarOpen]);

  return (
    <>
      {context?.canAnchorTag && (
        <CheckboxButton
          checked={isOrientationTagging ?? false}
          onChange={setIsOrientationTagging ?? (() => {})}
          className='!mt-5'
          fullWidth
        >
          {t('pictureFields.edit-orientation-tags')}
        </CheckboxButton>
      )}
      {isOrientationTagging && canCreate && (
        <Button
          variant='contained'
          color='primary'
          fullWidth
          className='!mt-5'
          onClick={context.activeTagId ? cancelAddOrientationTag : addOrientationTag}
        >
          {context.activeTagId ? t('common.abort') : t('pictureFields.add-orientation-tag')}
        </Button>
      )}
      {orientationTags !== undefined && orientationTags.length > 0 && !isOrientationTagging && (
        <Button
          variant='contained'
          color='primary'
          fullWidth
          className='!mt-5'
          onClick={toggleHideTags}
        >
          {context?.hideTags
            ? t('pictureFields.display-orientation-tags')
            : t('pictureFields.hide-orientation-tags')}
        </Button>
      )}
    </>
  );
};
