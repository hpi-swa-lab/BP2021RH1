import { useCreateExhibitionPictureMutation } from '../../../graphql/APIConnector';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { channelFactory } from '../../../helpers/channel-helpers';

export const AddExhibitionPicture = async (
  exhibitionId: string,
  selectedPictures: FlatPicture[]
) => {
  const [createExhibitionPicture] = useCreateExhibitionPictureMutation();
  if (!exhibitionId) return;
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

  for (let i = 0; i < selectedPictures.length; i++) {
    await addExhibitionPicture(selectedPictures[i].id);
  }
  exhibitionBroadcast.postMessage(true);
};
