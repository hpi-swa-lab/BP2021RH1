import { Card, Portal } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDailyPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureView from '../picture/PictureView';
import RichText from './../../common/RichText';
import DailyPictureInfo from './DailyPictureInfo';

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
  const pictureIds =
    import.meta.env.MODE === 'development'
      ? ['1', '2', '3'] //just for testing purposes
      : [
          //here are the real pictures for production
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
      pushHistoryWithoutRouter(`/picture/${id}`);
      setIsFocused(true);
    },
    [setIsFocused]
  );
  const dailyPictureId = choosePictureId(pictureIds);
  const { data } = useGetDailyPictureInfoQuery({ variables: { pictureId: dailyPictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';
  const description = picture?.descriptions?.[0]?.text ?? '';
  return (
    <div>
      {picture && (
        <div className='flex justify-center'>
          <Card className='flex flex-col-reverse md:flex-row rounded-md justify-between max-w-4xl'>
            <div className='p-4 flex flex-col overflow-hidden'>
              <h3 className={'text-2xl'}>{t('common.daily-picture')}</h3>
              <h4 className={'text-lg my-1'}>{t('common.description')}:</h4>
              <RichText value={description} className='break-words line-clamp-[9]' />
              <DailyPictureInfo picture={picture} />
            </div>
            <img
              className={'sm:w-auto sm:h-96 cursor-pointer sm:max-w-2xl object-cover'}
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
