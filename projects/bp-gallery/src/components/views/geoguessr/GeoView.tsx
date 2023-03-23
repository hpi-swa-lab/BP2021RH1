import GeoMap from './GeoMap';
import './GeoView.scss';
import {
  useGetAllArchiveTagsQuery,
  useGetPictureGeoInfoQuery,
  useGetPictureInfoQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import ZoomWrapper from '../picture/overlay/ZoomWrapper';
import { useEffect, useRef, useState } from 'react';
import { FlatArchiveTag, FlatPicture } from '../../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import { Box, Button, Modal, Typography } from '@mui/material';

const getAllPictureIds = (archives: FlatArchiveTag[]) => {
  const list: string[] = [];
  archives.forEach(archive => archive.pictures?.forEach(picture => list.push(picture.id)));
  return list;
};

const getTodaysPictureQueue = (pictureIds: string[]) => {
  const pictureNumber = 10;

  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
  const resultIndex = pictureIds.length - (1 % days);
  const list = [];
  for (let i = 0; i < pictureNumber; i++) {
    list.push(pictureIds[(resultIndex + i) % pictureIds.length]);
  }
  return list;
};

const GeoView = () => {
  const { t } = useTranslation();
  const fallbackPictureId = '3';

  const hasReadInstructions = Boolean(
    JSON.parse(localStorage.getItem('hasReadInstructions') || 'false')
  );
  const [modalOpen, setModalOpen] = useState(!hasReadInstructions);
  const dontShowAgain = () => {
    localStorage.setItem('hasReadInstructions', 'true');
    setModalOpen(false);
  };
  const archive_data = useGetAllArchiveTagsQuery().data;
  const archives: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(archive_data)?.archiveTags;

  const pictureQueue = useRef(['']);

  const getNextPicture = () => {
    const nextPicture = pictureQueue.current[0];
    pictureQueue.current = pictureQueue.current.filter((elem, index) => index !== 0);
    return nextPicture;
  };

  useEffect(() => {
    const allPictureIds = archives ? getAllPictureIds(archives) : [];
    pictureQueue.current = getTodaysPictureQueue(allPictureIds);
    setPictureId(getNextPicture);
  }, [archives]);

  const [pictureId, setPictureId] = useState<string>(fallbackPictureId);
  const [gameOver, setGameOver] = useState(false);
  const { data } = useGetPictureInfoQuery({
    variables: { pictureId: pictureId || fallbackPictureId },
  });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';

  const onNextPicture = () => {
    const nextPicture = getNextPicture();
    nextPicture ? setPictureId(nextPicture) : setGameOver(true);
  };
  const { data: geoData } = useGetPictureGeoInfoQuery({ variables: { pictureId } });
  const allGuesses = geoData?.pictureGeoInfos;
  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <Box className='absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] w-[400] bg-white shadow p-4 rounded flex gap-2 flex-col'>
          <Typography id='modal-title' variant='h6' component='h2'>
            {t('geo.explanation-title')}
          </Typography>
          <Typography id='modal-description'>{t('geo.explanation-nav')}</Typography>
          <Button onClick={dontShowAgain}>{t('common.dontShowAgain')}</Button>
        </Box>
      </Modal>
      {!gameOver && (
        <div className='guess-picture-view'>
          <ZoomWrapper blockScroll={true} pictureId={picture?.id ?? ''}>
            <div className='picture-wrapper'>
              <div className='picture-container'>
                <img src={pictureLink} alt={pictureLink} />
              </div>
            </div>
          </ZoomWrapper>
          <GeoMap allGuesses={allGuesses} onNextPicture={onNextPicture} pictureId={pictureId} />
        </div>
      )}
      {gameOver && (
        <div className='flex h-full justify-center items-center flex-col gap-4'>
          <div className='font-bold text-5xl'>{t('geo.end')}</div>
          <div className='text-xl'>{t('geo.end-sub')}</div>
        </div>
      )}
    </div>
  );
};

export default GeoView;
