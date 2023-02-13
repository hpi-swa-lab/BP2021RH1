import { Button } from '@mui/material';
import React, { MouseEventHandler } from 'react';
import { ArrowForwardIos } from '@mui/icons-material';
import './Carousel.scss';
import PictureGrid from './picture-gallery/PictureGrid';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { PictureFiltersInput } from '../../graphql/APIConnector';
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

  const { data, loading, refetch } = useGetPictures(queryParams, false, sortBy, true, 6 * rows);

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  return (
    <div className='carousel-container'>
      <h1 className='carousel-title'>{title}</h1>
      <hr className='carousel-separator' />
      {pictures && (
        <div className='carousel-picture-grid-container'>
          <PictureGrid
            pictures={pictures}
            hashBase={'carousel'}
            loading={loading}
            refetch={refetch}
            allowClicks={false}
            showDefaultAdornments={false}
            rows={rows}
          />
        </div>
      )}
      <Button onClick={onClick} className='carousel-show-more-button' endIcon={<ArrowForwardIos />}>
        {t('common.showMore')}
      </Button>
    </div>
  );
};

export default Carousel;
