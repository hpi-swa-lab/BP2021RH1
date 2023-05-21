import { Info } from '@mui/icons-material';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStorageState } from 'react-use-storage-state';
import {
  useGetAllPicturesByArchiveQuery,
  useGetPictureGeoInfoQuery,
  useGetPicturesForCollectionQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useVariant } from '../../../helpers/growthbook';
import useGetPictureLink from '../../../hooks/get-pictureLink.hook';
import {
  FlatArchiveTag,
  FlatCollection,
  FlatPictureGeoInfo,
} from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import ZoomWrapper from '../picture/overlay/ZoomWrapper';
import GeoMap from './GeoMap';

const getAllPictureIds = (archives: FlatArchiveTag[]) => {
  const allPictureIds: string[] = archives
    .map(archive => archive.pictures ?? [])
    .flat()
    .map(picture => picture.id);
  return allPictureIds;
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
  if (pictureIds.length === 0) {
    return [];
  }
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
  const pictureQueue = useRef(['']);
  const seed = 42;

  const [hasReadInstructions, setHasReadInstructions] = useStorageState<boolean>(
    'hasReadInstructions',
    false
  );
  const [modalOpen, setModalOpen] = useState(!hasReadInstructions);
  const [pictureId, setPictureId] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [needsExplanation, setNeedsExplanation] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const pictureLink = useGetPictureLink(pictureId);

  const { data: picturesData } = useGetAllPicturesByArchiveQuery();
  const archives: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(picturesData)?.archiveTags;

  const geoCollectionId = useVariant({ id: 'geopictures_collection_id', fallback: '' });
  const isGeoCollectionPictures = geoCollectionId !== '' && import.meta.env.MODE === 'production';
  const { data: geoCollectionPictureData } = useGetPicturesForCollectionQuery({
    variables: { collectionId: geoCollectionId },
  });

  const geoCollection: FlatCollection | undefined =
    useSimplifiedQueryResponseData(geoCollectionPictureData)?.collection;
  const geoCollectionPictureIds: string[] | undefined = geoCollection?.pictures?.map(
    picture => picture.id
  );

  const getNextPicture = useCallback(() => {
    return pictureQueue.current.shift() ?? null;
  }, []);

  const onNextPicture = useCallback(() => {
    const nextPicture = getNextPicture();
    setPictureId(nextPicture);
    if (!nextPicture) {
      setGameOver(true);
    }
  }, [getNextPicture]);

  useEffect(() => {
    if (!archives || isSet) {
      return;
    }
    const allPictureIds = isGeoCollectionPictures
      ? geoCollectionPictureIds ?? []
      : getAllPictureIds(archives);
    const shuffledPictureIds = shufflePictureIds(allPictureIds, seed);
    pictureQueue.current = getTodaysPictureQueue(shuffledPictureIds);
    onNextPicture();
    setIsSet(true);
  }, [archives, geoCollectionPictureIds, isGeoCollectionPictures, isSet, onNextPicture]);

  const dontShowAgain = () => {
    setHasReadInstructions(true);
    setModalOpen(false);
  };

  const { data: geoData } = useGetPictureGeoInfoQuery({
    variables: { pictureId: pictureId ?? '' },
    skip: !pictureId,
  });
  const allGuesses: FlatPictureGeoInfo[] | undefined =
    useSimplifiedQueryResponseData(geoData)?.pictureGeoInfos;
  return (
    <div className='h-full'>
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
          <Button data-testid='dont-show-again-button' onClick={dontShowAgain}>
            {t('common.dontShowAgain')}
          </Button>
        </Box>
      </Modal>
      {pictureId ? (
        <div className='guess-picture-view bg-black h-main'>
          <ZoomWrapper className='h-full' blockScroll={true} pictureId={pictureId}>
            <div className='picture-wrapper w-full'>
              <div className='picture-container w-full h-full flex align-center justify-center'>
                <img
                  className='h-full'
                  data-testid='geo-image'
                  src={pictureLink}
                  alt={pictureLink}
                />
              </div>
            </div>
          </ZoomWrapper>
          <div
            id='picture-info'
            className='absolute top-[5rem] right-1 text-white flex justify-center gap-1 cursor-pointer'
            onClick={() => {
              window.open(`/picture/${pictureId}`, '_blank');
            }}
          >
            <Info />
            {t('geo.getTip')}
          </div>
          <GeoMap
            allGuesses={allGuesses ?? []}
            onNextPicture={onNextPicture}
            pictureId={pictureId}
            needsExplanation={() => {
              setModalOpen(true);
              setNeedsExplanation(true);
            }}
          />
        </div>
      ) : gameOver ? (
        <div className='flex h-full justify-center items-center flex-col gap-4'>
          <div className='font-bold text-5xl'>{t('geo.end')}</div>
          <div className='text-xl'>{t('geo.end-sub')}</div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default GeoView;
