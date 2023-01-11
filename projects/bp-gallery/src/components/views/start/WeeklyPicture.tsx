import React from 'react';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { asApiPath } from '../../App';

const choosePictureId = (pictureIds: string[]) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  const resultIndex = weekNumber % pictureIds.length;
  return pictureIds[resultIndex];
};

const getPictureLink = (picture: FlatPicture | undefined, fallbackPicturePath: string) => {
  if (!picture || !picture.media?.url) {
    return fallbackPicturePath;
  }
  return asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`);
};
const WeeklyPicture = () => {
  //These are hard-coded until we implemented votes
  const fallbackPicturePath = '/bad-harzburg-stiftung-logo.png';
  const pictureIds = ['4'];

  const weeklyPictureId = choosePictureId(pictureIds);
  const { data } = useGetPictureInfoQuery({ variables: { pictureId: weeklyPictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  console.log(picture);
  // console.log(picture)
  const pictureLink = getPictureLink(picture, fallbackPicturePath);

  return <div>{picture && <img src={pictureLink} alt={picture.id} />}</div>;
};

export default WeeklyPicture;

export { choosePictureId };
