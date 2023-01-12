import { Button } from '@mui/material';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Carousel.scss';
import ScrollContainer from './ScrollContainer';
import { TagType } from '../../types/additionalFlatTypes';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
  PictureFiltersInput,
} from '../../graphql/APIConnector';
import DecadesList from '../views/search/DecadesList';
import TagList from '../views/search/TagList';

interface CategoryCarouselProps {
  title?: string;
  type: TagType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  rows?: number;
  queryParams?: LocationTagFiltersInput | PersonTagFiltersInput | KeywordTagFiltersInput;
  thumbnailQueryParams?: PictureFiltersInput;
  seperator?: boolean;
  archiveId?: string;
}

const CategoryCarousel = ({
  title,
  type,
  onClick,
  rows,
  queryParams,
  thumbnailQueryParams,
  seperator,
  archiveId = '0',
}: CategoryCarouselProps) => {
  const calculateMaxRowCount = () => {
    const tempRowCount = Math.max(1, Math.floor(Math.min(window.innerWidth - 64, 1200) / 300));
    if (Math.min(window.innerWidth - 64, 1200) >= tempRowCount * 300 + (tempRowCount - 1) * 8) {
      return tempRowCount;
    }
    return tempRowCount - 1;
  };

  const [rowCount, setRowCount] = useState<number>(calculateMaxRowCount());

  const onResize = useCallback(() => {
    setRowCount(calculateMaxRowCount());
  }, []);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='carousel-container'>
          {title && <h1 className='carousel-title'>{title}</h1>}
          {seperator && <hr className='carousel-seperator' />}
          <div className='carousel-collection-grid-container'>
            {type !== TagType.TIME_RANGE && (
              <TagList
                type={type}
                scroll={false}
                onClickBasePath={'/show-more/' + archiveId + '/' + type + '/'}
                maxItemAmount={rows ? rows * 3 : undefined}
                currentItemAmount={rows ? rowCount * rows : undefined}
                queryParams={queryParams}
                thumbnailQueryParams={thumbnailQueryParams}
              />
            )}
            {type === TagType.TIME_RANGE && (
              <DecadesList
                scroll={false}
                onClickBasePath={'/show-more/' + archiveId + '/date/'}
                thumbnailQueryParams={thumbnailQueryParams}
                currentItemAmount={rows ? rowCount * rows : undefined}
              />
            )}
          </div>
          {onClick && (
            <Button
              onClick={onClick}
              className='carousel-show-more-button'
              endIcon={<ArrowForwardIosIcon />}
            >
              Mehr Anzeigen
            </Button>
          )}
        </div>
      )}
    </ScrollContainer>
  );
};

export default CategoryCarousel;
