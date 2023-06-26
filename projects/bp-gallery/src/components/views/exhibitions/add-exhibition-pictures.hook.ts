import { useCallback } from 'react';
import { useCreateExhibitionPictureMutation } from '../../../graphql/APIConnector';
import { channelFactory } from '../../../helpers/channel-helpers';
import { FlatPicture } from '../../../types/additionalFlatTypes';

export const useAddExhibitionPictures = () => {
  const [createExhibitionPicture] = useCreateExhibitionPictureMutation();

  const addExhibitionPicture = useCallback(
    async (exhibitionId: string, pictureId: string) => {
      const result = await createExhibitionPicture({
        variables: {
          exhibitionIdealotId: exhibitionId,
          pictureId: pictureId,
          publishedAt: new Date().toISOString(),
        },
      });
      return result;
    },
    [createExhibitionPicture]
  );

  const addExhibitionPictures = useCallback(
    async (exhibitionId: string, selectedPictures: FlatPicture[]) => {
      const exhibitionBroadcast = channelFactory(`exhibition-${exhibitionId}`);
      await Promise.all(selectedPictures.map(pic => addExhibitionPicture(exhibitionId, pic.id)));
      exhibitionBroadcast.postMessage(true);
      exhibitionBroadcast.close();
    },
    [addExhibitionPicture]
  );

  return addExhibitionPictures;
};
