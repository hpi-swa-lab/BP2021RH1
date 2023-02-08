import { Button } from '@mui/material';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Carousel.scss';
import PictureGrid from './picture-gallery/PictureGrid';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import ScrollContainer from './ScrollContainer';
import { PictureFiltersInput } from '../../graphql/APIConnector';
import hashCode from '../../helpers/hash-code';
import { FlatPicture } from '../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import useGetPictures from '../../hooks/get-pictures.hook';

interface CarouselProps {
  title: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  onClick: MouseEventHandler<HTMLButtonElement>;
  sortBy?: string[];
  rows?: number;
}

const Carousel = ({ title, queryParams, onClick, sortBy, rows = 2 }: CarouselProps) => {
  const { t } = useTranslation();

  const calculateMaxPicturesPerRow = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));

  const calculateMinPicturesPerRow = (maxRowLength: number) => Math.max(2, maxRowLength - 2);

  const calculatePicturesPerRow = (
    maxRowLength: number,
    minRowLength: number,
    hashKey: string = 'carousel'
  ) => Math.round(hashCode(hashKey) * (maxRowLength - minRowLength) + minRowLength);

  const calculatePictureNumber = useCallback(() => {
    const maxRowLength = calculateMaxPicturesPerRow();
    const minRowLength = calculateMinPicturesPerRow(maxRowLength);
    let pictureNumber = calculatePicturesPerRow(maxRowLength, minRowLength);
    for (let row = 1; row < rows; row++) {
      pictureNumber += calculatePicturesPerRow(
        maxRowLength,
        minRowLength,
        'carousel' + String((pictureNumber - 1) * 124.22417246)
      );
    }
    return pictureNumber;
  }, [rows]);

  const [pictureNumber, setPictureNumber] = useState<number>(calculatePictureNumber());

  const onResize = useCallback(() => {
    setPictureNumber(calculatePictureNumber());
  }, [calculatePictureNumber]);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const { data, loading, error, fetchMore, refetch } = useGetPictures(
    queryParams,
    false,
    sortBy,
    6 * rows
  );

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='carousel-container'>
          <h1 className='carousel-title'>{title}</h1>
          <hr className='carousel-seperator' />
          {pictures && (
            <div className='carousel-picture-grid-container'>
              <PictureGrid
                pictures={pictures.slice(0, pictureNumber)}
                hashBase={'carousel'}
                loading={loading}
                refetch={refetch}
                allowClicks={false}
                showDefaultAdornments={false}
              />
            </div>
          )}
          <Button
            onClick={onClick}
            className='carousel-show-more-button'
            endIcon={<ArrowForwardIosIcon />}
          >
            {t('common.showMore')}
          </Button>
        </div>
      )}
    </ScrollContainer>
  );
};

export default Carousel;
