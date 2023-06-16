import { unionWith } from 'lodash';
import { useCallback, useMemo } from 'react';
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

  const updatePictureSequenceOrder = useUpdatePictureSequenceOrder();

  const [createPictureSequence] = useCreatePictureSequenceMutation({
    refetchQueries: ['getPictureInfo', 'getPictures', 'getMostLikedPictures'],
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
      updatePictureSequenceOrder(pictures);
      return pictureSequence.data?.createPictureSequence?.data?.id;
    },
    [dialog, t, createPictureSequence, updatePictureSequenceOrder]
  );

  return createSequence;
};

export const useUpdatePictureSequenceOrder = () => {
  const [updatePicture] = useUpdatePictureMutation({
    refetchQueries: ['getPictureInfo'],
  });

  const updatePictureSequenceOrder = useCallback(
    async (pictures: FlatPicture[]) => {
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
    },
    [updatePicture]
  );

  return updatePictureSequenceOrder;
};

export const useRemovePictureFromSequence = () => {
  const [updatePicture] = useUpdatePictureMutation({
    refetchQueries: ['getPictureInfo'],
  });

  const removePictureFromSequence = useCallback(
    (picture: FlatPicture) => {
      updatePicture({
        variables: {
          pictureId: picture.id,
          data: {
            picture_sequence: null,
            picture_sequence_order: null,
          },
        },
      });
    },
    [updatePicture]
  );

  return removePictureFromSequence;
};

export const collapseSequences = (pictures: FlatPicture[] | undefined) => {
  if (!pictures) {
    return undefined;
  }
  return unionWith(
    pictures,
    (a, b) => !!a.picture_sequence && a.picture_sequence.id === b.picture_sequence?.id
  );
};

export const useCollapseSequences = (pictures: FlatPicture[] | undefined, enable = true) =>
  useMemo(() => (enable ? collapseSequences(pictures) : pictures), [pictures, enable]);
