import { Box, Button, Modal, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetAllPicturesByArchiveQuery,
  useGetPictureGeoInfoQuery,
  useGetPictureInfoQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import { FlatArchiveTag, FlatPicture } from '../../../types/additionalFlatTypes';
import ZoomWrapper from '../picture/overlay/ZoomWrapper';
import GeoMap from './GeoMap';
import { useStorageState } from 'react-use-storage-state';

const getAllPictureIds = (archives: FlatArchiveTag[]) => {
  const list: string[] = [];
  archives.forEach(archive => archive.pictures?.forEach(picture => list.push(picture.id)));
  return list;
};

const shufflePictureIds = (pictureIds: string[], seed: number) => {
  const newPictureIds = [...pictureIds];
  for (let i = newPictureIds.length - 1; i > 0; i--) {
    const j = Math.abs(Math.floor(i * Math.sin(i % seed)));
    [newPictureIds[i], newPictureIds[j]] = [newPictureIds[j], newPictureIds[i]];
  }
  return newPictureIds;
};

const getTodaysPictureQueue = (pictureIds: string[]) => {
  const pictureNumber = 10;
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
  const resultIndex = pictureIds.length % days;
  const list = [];
  for (let i = 0; i < pictureNumber; i++) {
    list.push(pictureIds[(resultIndex + i) % pictureIds.length]);
  }
  return list;
};

const GeoView = () => {
  const { t } = useTranslation();
  const fallbackPictureId = '3';
  const pictureQueue = useRef(['']);
  const seed = 42;

  const [hasReadInstructions, setHasReadInstructions] = useStorageState<boolean>(
    'hasReadInstructions',
    false
  );
  const [modalOpen, setModalOpen] = useState(!hasReadInstructions);
  const dontShowAgain = () => {
    setHasReadInstructions(true);
    setModalOpen(false);
  };

  const { data: picturesData } = useGetAllPicturesByArchiveQuery();
  const archives: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(picturesData)?.archiveTags;

  useEffect(() => {
    const allPictureIds = archives ? getAllPictureIds(archives) : [];
    const shuffledPictureIds = shufflePictureIds(allPictureIds, seed);
    pictureQueue.current = getTodaysPictureQueue(shuffledPictureIds);
    setPictureId(getNextPicture());
  }, [archives]);

  const getNextPicture = () => {
    const nextPicture = pictureQueue.current[0];
    pictureQueue.current = pictureQueue.current.slice(1);
    return nextPicture;
  };

  const [pictureId, setPictureId] = useState<string>(fallbackPictureId);
  const [gameOver, setGameOver] = useState(false);
  const [needsExplanation, setNeedsExplanation] = useState(false);
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
        <Box className='modal absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] w-[400] bg-white shadow p-4 rounded flex gap-2 flex-col'>
          <Typography id='modal-title' variant='h6' component='h2'>
            {needsExplanation ? t('geo.explanation-reminder') : t('geo.explanation-title')}
          </Typography>
          <Typography id='modal-description'>{t('geo.explanation-nav')}</Typography>
          <Button id='dont-show-again-button' onClick={dontShowAgain}>
            {t('common.dontShowAgain')}
          </Button>
        </Box>
      </Modal>
      {!gameOver && (
        <div className='guess-picture-view bg-black h-main'>
          <ZoomWrapper className='h-full' blockScroll={true} pictureId={pictureId}>
            <div className='picture-wrapper w-full'>
              <div className='picture-container w-full h-full flex align-center justify-center'>
                <img className='h-full' id='geo-image' src={pictureLink} alt={pictureLink} />
              </div>
            </div>
          </ZoomWrapper>
          <div
            id='picture-info'
            className='absolute top-[5rem] right-1 text-white flex justify-center gap-1 cursor-pointer'
            onClick={() => {
              window.open(`${window.location.origin}/picture/${pictureId}`, '_blanc');
            }}
          >
            <Info />
            {t('geo.getTip')}
          </div>
          <GeoMap
            allGuesses={allGuesses}
            onNextPicture={onNextPicture}
            pictureId={pictureId}
            needsExplanation={() => {
              setModalOpen(true);
              setNeedsExplanation(true);
            }}
          />
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
