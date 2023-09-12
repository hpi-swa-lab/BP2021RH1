import { Portal } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDailyPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath } from '../../../helpers/app-helpers';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import { useBlockImageContextMenuByPicture } from '../../../hooks/block-image-context-menu.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import RichText from '../../common/RichText';
import PictureView from '../picture/PictureView';
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
  const pictureIds = [
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
  const pictureLink = asUploadPath(picture?.media);
  const description = picture?.descriptions?.[0]?.text ?? '';

  const onImageContextMenu = useBlockImageContextMenuByPicture(picture);

  return (
    <div className='rounded-[15px] p-4'>
      {picture && (
        <div>
          <h2 className='ml-0'>{t('common.daily-picture')}</h2>

          <div className={`flex flex-col justify-center`}>
            <img
              className={'w-auto h-96 cursor-pointer max-w-2xl object-cover rounded'}
              id='daily-picture'
              src={pictureLink}
              alt={t('common.daily-picture')}
              onClick={async () => {
                await navigateToPicture(picture.id);
              }}
              onContextMenu={onImageContextMenu}
            />
            <div className={`py-2 flex flex-col overflow-hidden`}>
              <RichText value={description} className='break-words line-clamp-[9]' />
              <DailyPictureInfo picture={picture} />
            </div>
          </div>
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
