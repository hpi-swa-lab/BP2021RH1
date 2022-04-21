import { useCallback, useState } from 'react';
import {
  useGetPicturesForCollectionLazyQuery,
  useSetPicturesForCollectionMutation,
} from '../../../graphql/APIConnector';

const useAddPicturesToCollection = () => {
  const [newPictures, setNewPictures] = useState<string[]>([]);
  const [setPicturesForCollection] = useSetPicturesForCollectionMutation();
  const [getPicturesForCollection] = useGetPicturesForCollectionLazyQuery({
    onCompleted: data => {
      const id = data.collection?.data?.id;
      if (!id) {
        return;
      }
      const pictures: string[] =
        data.collection?.data?.attributes?.pictures?.data.map(p => p.id as string) ?? [];
      setPicturesForCollection({
        variables: {
          collectionId: id,
          pictureIds: pictures.concat(newPictures),
        },
      });
    },
    fetchPolicy: 'network-only',
  });

  return useCallback(
    (collectionId: string, pictureIds: string[]) => {
      setNewPictures(pictureIds);
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
