import { useCallback, useState } from 'react';
import {
  useGetPicturesForCollectionLazyQuery,
  useSetPicturesForCollectionMutation,
} from '../../../graphql/APIConnector';

/**
 * This convoluted function does:
 *  - load all existing pictures for the collection to add new pictures to
 *  - concats the new pictures to that array
 *  - set the pictures array on that collection
 */
const useAddPicturesToCollection = () => {
  const [picturesToAdd, setPicturesToAdd] = useState<string[]>([]);
  const [setPicturesForCollection] = useSetPicturesForCollectionMutation();

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
      });
    },
    [picturesToAdd, setPicturesForCollection]
  );

  const [getPicturesForCollection] = useGetPicturesForCollectionLazyQuery({
    onCompleted: setNewPictures,
    fetchPolicy: 'network-only',
  });

  return useCallback(
    (collectionId: string, pictureIds: string[]) => {
      setPicturesToAdd(pictureIds);
      getPicturesForCollection({
        variables: {
          collectionId,
        },
      });
    },
    [getPicturesForCollection]
  );
};

export default useAddPicturesToCollection;
