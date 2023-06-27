import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogPreset, useDialog } from '../components/provider/DialogProvider';
import {
  useCanRunUnpublishPictureMutation,
  useUnpublishPictureMutation,
} from '../graphql/APIConnector';
import { FlatPicture } from '../types/additionalFlatTypes';

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

// placed here instead of in can-do-hooks to put it near the place
// where the actual mutation is executed (since the mutation name differs
// from the function name)
export const useCanDeletePicture = (id: string) => {
  const { canRun: canDeletePicture, loading } = useCanRunUnpublishPictureMutation({
    variables: {
      id,
    },
  });
  return { canDeletePicture, loading };
};

export default useDeletePicture;
