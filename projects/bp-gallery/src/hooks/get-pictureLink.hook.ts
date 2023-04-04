import { useGetPictureInfoQuery } from '../graphql/APIConnector';
import { FlatPicture } from '../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { asApiPath } from '../helpers/app-helpers';

const useGetPictureLink = (pictureId: string) => {
  const { data: pictureData } = useGetPictureInfoQuery({
    variables: { pictureId: pictureId },
  });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(pictureData)?.picture;
  return getPictureLinkFromFlatPicture(picture);
};

const getPictureLinkFromFlatPicture = (picture: FlatPicture | undefined) => {
  return picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';
};

export { getPictureLinkFromFlatPicture };

export default useGetPictureLink;
