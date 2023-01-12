import React, { useCallback, useState } from 'react';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import {
  zoomIntoPicture,
  zoomOutOfPicture,
} from '../../common/picture-gallery/helpers/picture-animations';
import PictureView from '../picture/PictureView';
import { Card } from '@mui/material';

const choosePictureId = (pictureIds: string[]) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  const resultIndex = weekNumber % pictureIds.length;
  return pictureIds[resultIndex];
};

const WeeklyPicture = () => {
  //These are hard-coded until we implemented votes
  const pictureIds = ['4'];
  const [isFocussed, setIsFocussed] = useState<boolean>(false);
  const navigateToPicture = useCallback(
    async (id: string) => {
      window.history.pushState({}, '', `/picture/${id}`);
      await zoomIntoPicture(`picture-preview-for-${id}`);
      setIsFocussed(true);
    },
    [setIsFocussed]
  );
  const weeklyPictureId = choosePictureId(pictureIds);
  const { data } = useGetPictureInfoQuery({ variables: { pictureId: weeklyPictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;

  return (
    <div>
      {picture && (
        <Card
          className={'flex flex-row'}
          onClick={async () => {
            await navigateToPicture(picture.id);
          }}
        >
          <p className={'text-blue-600'}>hello</p>
          <PicturePreview picture={picture} onClick={() => {}} />
        </Card>
      )}
      {isFocussed && picture && (
        <PictureView
          initialPictureId={picture.id}
          onBack={async () => {
            setIsFocussed(false);
            await zoomOutOfPicture(`picture-preview-for-${picture.id}`);
          }}
        />
      )}
    </div>
  );
};

export default WeeklyPicture;

export { choosePictureId };
