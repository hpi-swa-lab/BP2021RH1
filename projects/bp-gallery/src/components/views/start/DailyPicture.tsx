import React, { useCallback, useState } from 'react';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import {
  zoomIntoPicture,
  zoomOutOfPicture,
} from '../../common/picture-gallery/helpers/picture-animations';
import PictureView from '../picture/PictureView';
import { Portal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatTimeStamp } from '../../../helpers/format-timestamp';
import Editor from '../../common/editor/Editor';
import { FolderSpecial, Event } from '@mui/icons-material';
import { asApiPath } from '../../../helpers/app-helpers';

const choosePictureId = (pictureIds: string[]) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
  const resultIndex = days % pictureIds.length;
  return pictureIds[resultIndex];
};

const DailyPicture = () => {
  const root = document.getElementById('root');
  //These are hard-coded until we implemented votes
  const pictureIds = [
    '2254',
    '2265',
    '11715',
    '13258',
    '14440',
    '13282',
    '14998',
    '13124',
    '13125',
    '13034',
    '12689',
    '12939',
    '6837',
    '7943',
    '6863',
    '6773',
    '7886',
    '7954',
    '9350',
    '8255',
    '10838',
  ];
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigateToPicture = useCallback(
    async (id: string) => {
      window.history.pushState({}, '', `/picture/${id}`);
      await zoomIntoPicture(`picture-preview-for-${id}`);
      setIsFocused(true);
    },
    [setIsFocused]
  );
  const dailyPictureId = choosePictureId(pictureIds);
  const { data } = useGetPictureInfoQuery({ variables: { pictureId: dailyPictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';
  const description = picture?.descriptions?.[0]?.text ?? '';
  const pictureDate = formatTimeStamp(picture?.time_range_tag);
  const pictureArchive = picture?.archive_tag?.name;
  const pictureArchiveId = picture?.archive_tag?.id;
  const pictureArchiveLink = pictureArchiveId ? `/archives/${pictureArchiveId}` : '';
  return (
    <div>
      {picture && (
        <>
          <h3 className={'text-2xl'}>{t('common.daily-picture')}</h3>
          <div className={'flex flex-col place-items-center'}>
            <img
              className={'w-screen sm:w-auto sm:h-50vh'}
              src={pictureLink}
              alt={t('common.daily-picture')}
              onClick={async () => {
                await navigateToPicture(picture.id);
              }}
            />
            <div className={'flex flex-col max-w-4xl'}>
              <p className={'line-clamp-5'}>
                <h4 className={'text-lg my-1'}>{t('pictureFields.descriptions')}:</h4>
                <Editor value={description} />
              </p>
              <div className={'flex-1'} />
              <div className={'flex items-center gap-2 my-2'}>
                <Event /> {pictureDate}
              </div>
              <div className={'flex item-center gap-2'}>
                <FolderSpecial /> <a href={pictureArchiveLink}>{pictureArchive} </a>
              </div>
            </div>
          </div>
        </>
      )}

      {isFocused && picture && (
        <Portal container={root}>
          <PictureView
            initialPictureId={picture.id}
            onBack={async () => {
              setIsFocused(false);
              await zoomOutOfPicture(`picture-preview-for-${picture.id}`);
            }}
          />
        </Portal>
      )}
    </div>
  );
};

export default DailyPicture;
