import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../types/additionalFlatTypes';
import { useUnpublishPictureMutation } from '../graphql/APIConnector';
import { useDialog, DialogPreset } from '../components/provider/DialogProvider';

const useDeletePicture = () => {
  const [unpublishPicture] = useUnpublishPictureMutation();
  const dialog = useDialog();
  const { t } = useTranslation();

  return useCallback(
    (picture: FlatPicture) => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<void>(async resolve => {
        const mediaId = picture.media?.id;
        if (!mediaId) {
          return;
        }
        const reallyDelete = await dialog({
          title: t('curator.reallyDeletePicture'),
          content: t('curator.reallyDeletePictureText'),
          preset: DialogPreset.CONFIRM,
        });
        if (!reallyDelete) {
          resolve();
          return;
        }
        unpublishPicture({ variables: { id: picture.id } }).then(() => {
          resolve();
        });
      });
    },
    [unpublishPicture, t, dialog]
  );
};

export default useDeletePicture;
