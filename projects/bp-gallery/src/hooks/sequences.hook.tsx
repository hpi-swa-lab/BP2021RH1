import { Add, Close, Merge } from '@mui/icons-material';
import { unionWith, uniqBy } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDialog } from '../components/provider/DialogProvider';
import {
  useCreatePictureSequenceMutation,
  useUpdatePictureMutation,
} from '../graphql/APIConnector';
import { FlatPicture, FlatPictureSequence } from '../types/additionalFlatTypes';

export const useCreateSequence = () => {
  const { t } = useTranslation();
  const dialog = useDialog();

  const updatePictureSequenceOrder = useUpdatePictureSequenceOrder();

  const [createPictureSequence] = useCreatePictureSequenceMutation({
    refetchQueries: ['getPictureInfo', 'getPictures', 'getMostLikedPictures'],
  });

  const createSequence = useCallback(
    async (pictures: FlatPicture[]) => {
      const existingSequence = pictures.find(
        picture => !!picture.picture_sequence
      )?.picture_sequence;
      if (existingSequence) {
        enum Options {
          ABORT,
          JOIN_ALL_SEQUENCES,
          NEW_SEQUENCE,
        }
        const option = await dialog({
          title: t('curator.alreadyInSequence.title'),
          content: t('curator.alreadyInSequence.content'),
          options: [
            { name: t('common.abort'), icon: <Close />, value: Options.ABORT },
            {
              name: t('curator.alreadyInSequence.joinAllSequences'),
              icon: <Merge />,
              value: Options.JOIN_ALL_SEQUENCES,
            },
            {
              name: t('curator.alreadyInSequence.newSequence'),
              icon: <Add />,
              value: Options.NEW_SEQUENCE,
            },
          ],
        });
        switch (option) {
          case Options.NEW_SEQUENCE:
            // fall through to the createPictureSequence call
            break;
          case Options.JOIN_ALL_SEQUENCES: {
            const allPictures = uniqBy(
              pictures.flatMap(picture => picture.picture_sequence?.pictures ?? [picture]),
              picture => picture.id
            );
            updatePictureSequenceOrder(allPictures, existingSequence);
            return;
          }
          case Options.ABORT:
          default:
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
    refetchQueries: ['getPictureInfo', 'getPictures', 'getMostLikedPictures'],
  });

  const updatePictureSequenceOrder = useCallback(
    async (pictures: FlatPicture[], sequence?: FlatPictureSequence) => {
      await Promise.all(
        pictures.map((picture, index) =>
          updatePicture({
            variables: {
              pictureId: picture.id,
              data: {
                picture_sequence_order: index + 1, // avoid 0
                picture_sequence: sequence?.id,
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
    refetchQueries: ['getPictureInfo', 'getPictures', 'getMostLikedPictures'],
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
