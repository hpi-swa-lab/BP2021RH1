import { Button } from '@mui/material';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Carousel.scss';
import ScrollContainer from './ScrollContainer';
import { FlatTag, TagType, Thumbnail } from '../../types/additionalFlatTypes';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
  PictureFiltersInput,
} from '../../graphql/APIConnector';
import DecadesList from '../views/search/DecadesList';
import TagList from '../views/search/TagList';
import { useTranslation } from 'react-i18next';
import useGenericTagEndpoints from '../../hooks/generic-endpoints.hook';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';

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
  const { t } = useTranslation();

  const basePath = '/show-more/' + archiveId + '/' + type + '/';

  const calculateMaxCategoriesPerRow = () => {
    const tempRowLenght = Math.max(1, Math.floor(Math.min(window.innerWidth - 64, 1200) / 300));
    if (Math.min(window.innerWidth - 64, 1200) >= tempRowLenght * 300 + (tempRowLenght - 1) * 8) {
      return tempRowLenght;
    }
    return tempRowLenght - 1;
  };

  const [rowLength, setRowLength] = useState<number>(calculateMaxCategoriesPerRow());

  const onResize = useCallback(() => {
    setRowLength(calculateMaxCategoriesPerRow());
  }, []);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const { tagsWithThumbnailQuery } = useGenericTagEndpoints(type);

  const { data, loading, error, fetchMore } = tagsWithThumbnailQuery({
    variables: {
      filters: queryParams,
      thumbnailFilters: thumbnailQueryParams,
      start: 0,
      limit: 1,
      sortBy: ['name:asc'],
    },
  });

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

  console.log(flattenedTags);

  if (flattenedTags?.length === 0) {
    return <div></div>;
  } else {
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
                  onClickBasePath={basePath}
                  currentItemAmount={rows ? rowLength * rows : undefined}
                  queryParams={queryParams}
                  thumbnailQueryParams={thumbnailQueryParams}
                />
              )}
              {type === TagType.TIME_RANGE && (
                <DecadesList
                  scroll={false}
                  onClickBasePath={basePath}
                  thumbnailQueryParams={thumbnailQueryParams}
                  currentItemAmount={rows ? rowLength * rows : undefined}
                />
              )}
            </div>
            {onClick && (
              <Button
                onClick={onClick}
                className='carousel-show-more-button'
                endIcon={<ArrowForwardIosIcon />}
              >
                {t('common.showMore')}
              </Button>
            )}
          </div>
        )}
      </ScrollContainer>
    );
  }
};

export default CategoryCarousel;
