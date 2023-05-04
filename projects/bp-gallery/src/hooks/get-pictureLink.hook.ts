import { useGetPictureInfoQuery } from '../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { asUploadPath } from '../helpers/app-helpers';
import { FlatPicture } from '../types/additionalFlatTypes';

const useGetPictureLink = (pictureId: string) => {
  const { data: pictureData } = useGetPictureInfoQuery({
    variables: { pictureId: pictureId },
  });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(pictureData)?.picture;
  return asUploadPath(picture?.media);
};

export default useGetPictureLink;
