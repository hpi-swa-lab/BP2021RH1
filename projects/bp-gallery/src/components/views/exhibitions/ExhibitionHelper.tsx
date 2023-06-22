import { FlatPicture } from '../../../types/additionalFlatTypes';
import { channelFactory } from '../../../helpers/channel-helpers';
import { MutationFunction } from '../../../types/helper';
import { useCreateExhibitionPictureMutation } from '../../../graphql/APIConnector';

export const addExhibitionPicture = async (
  exhibitionId: string,
  selectedPictures: FlatPicture[],
  createExhibitionPicture: MutationFunction<typeof useCreateExhibitionPictureMutation>
) => {
  const exhibitionBroadcast = channelFactory(`exhibition-${exhibitionId}`);
  const addExhibitionPicture = async (pictureId: string) => {
    const result = await createExhibitionPicture({
      variables: {
        exhibitionIdealotId: exhibitionId,
        pictureId: pictureId,
        publishedAt: new Date().toISOString(),
      },
    });
    return result;
  };

  await Promise.all(selectedPictures.map(pic => addExhibitionPicture(pic.id)));
  exhibitionBroadcast.postMessage(true);
  exhibitionBroadcast.close();
};
