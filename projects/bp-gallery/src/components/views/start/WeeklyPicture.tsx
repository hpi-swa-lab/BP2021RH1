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
import { useTranslation } from 'react-i18next';
import EventIcon from '@mui/icons-material/Event';
import { formatTimeStamp } from '../../../helpers/format-timestamp';
import Editor from '../../common/editor/Editor';
import { FolderSpecial } from '@mui/icons-material';

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
  const pictureIds = ['7'];
  const { t } = useTranslation();
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
  const description = picture?.descriptions?.[0]?.text || '';
  const pictureDate = formatTimeStamp(picture?.time_range_tag);
  const pictureArchive = picture?.archive_tag?.name;
  return (
    <div>
      {picture && (
        <Card
          className={'flex flex-col md:flex-row rounded-md justify-between'}
          onClick={async () => {
            await navigateToPicture(picture.id);
          }}
        >
          <div className={'p-4 flex flex-col'}>
            <h3 className={'text-2xl'}>{t('common.weekly-picture')}</h3>
            <p className={'line-clamp-5'}>
              <h4 className={'text-lg my-1'}>{t('pictureFields.descriptions')}:</h4>
              <Editor value={description} />
            </p>
            <div className={'flex-1'} />
            <div className={'flex items-center gap-2 my-2'}>
              <EventIcon /> {pictureDate}
            </div>
            <div className={'flex item-center gap-2'}>
              <FolderSpecial /> {pictureArchive}
            </div>
          </div>
          <div>
            <PicturePreview picture={picture} onClick={() => {}} />
          </div>
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
