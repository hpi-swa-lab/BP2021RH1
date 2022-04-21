import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../../../types/additionalFlatTypes';
import { useUnpublishPictureMutation } from '../../../../graphql/APIConnector';
import { DialogContext, DialogPreset } from '../../../shared/DialogWrapper';

const useDeletePicture = () => {
  const [unpublishPicture] = useUnpublishPictureMutation();
  const prompt = useContext(DialogContext);
  const { t } = useTranslation();

  return useCallback(
    (picture: FlatPicture) => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<void>(async resolve => {
        const mediaId = picture.media?.id;
        if (!mediaId) {
          return;
        }
        const reallyDelete = await prompt({
          title: t('curator.reallyDelete'),
          content: t('curator.reallyDeleteText'),
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
    [unpublishPicture, t, prompt]
  );
};

export default useDeletePicture;
