import { Button } from '@mui/material';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Carousel.scss';
import PictureGrid from './picture-gallery/PictureGrid';
import { FlatPicture } from '../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import ScrollContainer from './ScrollContainer';
import { PictureFiltersInput, useGetPicturesQuery } from '../../graphql/APIConnector';
import hashCode from '../../helpers/hash-code';

interface CarouselProps {
  title: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  onClick: MouseEventHandler<HTMLButtonElement>;
  sortBy?: string[];
}

const Carousel = ({ title, queryParams, onClick, sortBy }: CarouselProps) => {
  const calculateMaxRowCount = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));

  const [maxRowCount, setMaxRowCount] = useState<number>(calculateMaxRowCount());

  const calculatePictureNumber = useCallback(
    (hashBase: string) => {
      const newMaxRowCount = calculateMaxRowCount();
      if (newMaxRowCount !== maxRowCount) {
        setMaxRowCount(newMaxRowCount);
      }
      const minRowCount = Math.max(2, maxRowCount - 2);
      const firstRowLenght = Math.round(
        hashCode(hashBase) * (maxRowCount - minRowCount) + minRowCount
      );
      const secondRowLenght = Math.round(
        hashCode(hashBase + String((firstRowLenght - 1) * 124.22417246)) *
          (maxRowCount - minRowCount) +
          minRowCount
      );
      return firstRowLenght + secondRowLenght;
    },
    [maxRowCount]
  );

  const [pictureNumber, setPictureNumber] = useState<number>(calculatePictureNumber('carousel'));

  const onResize = useCallback(() => {
    setPictureNumber(calculatePictureNumber('carousel'));
  }, [calculatePictureNumber]);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const { data, loading, error, fetchMore, refetch } = useGetPicturesQuery({
    variables: {
      filters: queryParams as PictureFiltersInput,
      pagination: {
        start: 0,
        limit: 12,
      },
      sortBy,
    },
    notifyOnNetworkStatusChange: true,
    skip: false,
  });
  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='carousel-container'>
          <h1 className='carousel-title'>{title}</h1>
          <hr className='carousel-seperator' />
          <div className='carousel-picture-grid-container'>
            {pictures && (
              <PictureGrid
                pictures={pictures.slice(0, pictureNumber)}
                hashBase={'carousel'}
                loading={loading}
                refetch={refetch}
                //viewOnly={true}
              />
            )}
          </div>
          <Button
            onClick={onClick}
            className='carousel-show-more-button'
            endIcon={<ArrowForwardIosIcon />}
          >
            Mehr Anzeigen
          </Button>
        </div>
      )}
    </ScrollContainer>
  );
};

export default Carousel;
