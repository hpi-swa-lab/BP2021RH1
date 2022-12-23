import { Button } from '@mui/material';
import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Carousel.scss';
import PictureGrid from './picture-gallery/PictureGrid';
import useGetPictures from '../../hooks/get-pictures.hook';
import { FlatPicture } from '../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { PictureFiltersInput } from '../../graphql/APIConnector';

interface CarouselProps {
  title: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
}

const Carousel = ({ title, queryParams }: CarouselProps) => {
  const { data, loading, error, fetchMore, refetch } = useGetPictures(queryParams, false);
  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  return (
    <div className='carousel-container'>
      <h1 className='carousel-title'>{title}</h1>
      <hr className='carousel-seperator' />
      <div className='carousel-picture-grid-container'>
        {pictures && (
          <PictureGrid
            pictures={pictures}
            hashBase={'carousel'}
            loading={loading}
            refetch={refetch}
            //viewOnly={true}
          />
        )}
      </div>
      <Button
        className='carousel-show-more-button'
        endIcon={<ArrowForwardIosIcon />}
        onClick={() => {}}
      >
        Mehr Anzeigen
      </Button>
    </div>
  );
};

export default Carousel;
