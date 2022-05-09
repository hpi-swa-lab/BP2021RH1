import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetPicturesForCollectionLazyQuery,
  useSetPicturesForCollectionMutation,
} from '../../../graphql/APIConnector';
import { AlertContext, AlertType } from '../../shared/AlertWrapper';

/**
 * This convoluted function does:
 *  - load all existing pictures for the collection to add new pictures to
 *  - concats the new pictures to that array
 *  - set the pictures array on that collection
 */
const useManageCollectionPictures = () => {
  const openAlert = useContext(AlertContext);
  const { t } = useTranslation();

  const [picturesToAdd, setPicturesToAdd] = useState<string[]>([]);
  const [picturesToRemove, setPicturesToRemove] = useState<string[]>([]);
  const [setPicturesForCollection] = useSetPicturesForCollectionMutation({
    refetchQueries: ['getPictures'],
  });

  const setNewPictures = useCallback(
    data => {
      const id = data.collection?.data?.id;
      if (!id) {
        return;
      }
      const pictureData: any[] | undefined = data.collection?.data?.attributes?.pictures?.data; // ugly but more performant than simplify hook
      const pictures: string[] = pictureData?.map((p: any) => p.id as string) ?? [];
      setPicturesForCollection({
        variables: {
          collectionId: id,
          pictureIds: pictures.concat(picturesToAdd),
        },
      }).then(() => {
        openAlert({
          alertType: AlertType.SUCCESS,
          message: t('curator.addedPicturesToCollection'),
          duration: 5000,
        });
      });
    },
    [picturesToAdd, setPicturesForCollection, t, openAlert]
  );

  const removePictures = useCallback(
    data => {
      const id = data.collection?.data?.id;
      if (!id) {
        return;
      }
      const pictureData: any[] | undefined = data.collection?.data?.attributes?.pictures?.data; // ugly but more performant than simplify hook
      const filteredPictures: string[] = (
        pictureData?.map((p: any) => p.id as string) ?? []
      ).filter(id => !picturesToRemove.includes(id));
      setPicturesForCollection({
        variables: {
          collectionId: id,
          pictureIds: filteredPictures,
        },
      }).then(() => {
        openAlert({
          alertType: AlertType.SUCCESS,
          message: t('curator.removedPicturesFromCollection'),
          duration: 5000,
        });
      });
    },
    [picturesToRemove, setPicturesForCollection, t, openAlert]
  );

  const [getPicturesForOriginCollection] = useGetPicturesForCollectionLazyQuery({
    onCompleted: removePictures,
    fetchPolicy: 'network-only',
  });

  const [getPicturesForTargetCollection] = useGetPicturesForCollectionLazyQuery({
    onCompleted: setNewPictures,
    fetchPolicy: 'network-only',
  });

  return {
    addPicturesToCollection: useCallback(
      (collectionId: string, pictureIds: string[]) => {
        setPicturesToAdd(pictureIds);
        getPicturesForTargetCollection({
          variables: {
            collectionId,
          },
        });
      },
      [getPicturesForTargetCollection]
    ),
    removePicturesFromCollection: useCallback(
      (collectionId: string, pictureIds: string[]) => {
        setPicturesToRemove(pictureIds);
        getPicturesForOriginCollection({
          variables: {
            collectionId,
          },
        });
      },
      [getPicturesForOriginCollection]
    ),
  };
};

export default useManageCollectionPictures;
