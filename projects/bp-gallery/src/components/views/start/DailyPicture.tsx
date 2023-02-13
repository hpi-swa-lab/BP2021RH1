import React, { useCallback, useState } from 'react';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { Card, Portal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatTimeStamp } from '../../../helpers/format-timestamp';
import Editor from '../../common/editor/Editor';
import { FolderSpecial, Event } from '@mui/icons-material';
import { asApiPath } from '../../../helpers/app-helpers';
import PictureView from '../picture/PictureView';

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
    '16393',
    '16297',
    '16280',
    '16235',
    '16150',
    '16155',
    '16134',
    '16111',
    '16055',
    '15941',
    '15903',
    '16373',
    '12625',
    '14365',
    '13245',
    '13116',
    '13110',
    '14064',
  ];
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigateToPicture = useCallback(
    async (id: string) => {
      window.history.pushState({}, '', `/picture/${id}`);
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
        <div className='flex justify-center'>
          <Card className='flex flex-col-reverse md:flex-row rounded-md justify-between max-w-4xl max-h-fit'>
            <div className='p-4 flex flex-col'>
              <h3 className={'text-2xl'}>{t('common.daily-picture')}</h3>
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
            <img
              className={'w-screen sm:w-auto sm:h-96'}
              id='daily-picture'
              src={pictureLink}
              alt={t('common.daily-picture')}
              onClick={async () => {
                await navigateToPicture(picture.id);
              }}
            />
          </Card>
        </div>
      )}

      {isFocused && picture && (
        <Portal container={root}>
          <PictureView
            initialPictureId={picture.id}
            onBack={() => {
              setIsFocused(false);
            }}
          />
        </Portal>
      )}
    </div>
  );
};

export default DailyPicture;
