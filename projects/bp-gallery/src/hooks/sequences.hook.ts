import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogPreset, useDialog } from '../components/provider/DialogProvider';
import {
  useCreatePictureSequenceMutation,
  useUpdatePictureMutation,
} from '../graphql/APIConnector';
import { FlatPicture } from '../types/additionalFlatTypes';

export const useCreateSequence = () => {
  const { t } = useTranslation();
  const dialog = useDialog();

  const [createPictureSequence] = useCreatePictureSequenceMutation({
    refetchQueries: ['getPictureInfo', 'getPictures', 'getMostLikedPictures'],
  });
  const [updatePicture] = useUpdatePictureMutation({
    refetchQueries: ['getPictureInfo'],
  });

  const createSequence = useCallback(
    async (pictures: FlatPicture[]) => {
      if (pictures.some(picture => !!picture.picture_sequence)) {
        const really = await dialog({
          preset: DialogPreset.CONFIRM,
          title: t('curator.alreadyInSequence.title'),
          content: t('curator.alreadyInSequence.content'),
        });
        if (!really) {
          return;
        }
      }
      const pictureSequence = await createPictureSequence({
        variables: {
          pictures: pictures.map(picture => picture.id),
        },
      });
      await Promise.all(
        pictures.map((picture, index) =>
          updatePicture({
            variables: {
              pictureId: picture.id,
              data: {
                picture_sequence_order: index + 1, // avoid 0
              },
            },
          })
        )
      );
      return pictureSequence.data?.createPictureSequence?.data?.id;
    },
    [dialog, t, createPictureSequence, updatePicture]
  );

  return createSequence;
};
