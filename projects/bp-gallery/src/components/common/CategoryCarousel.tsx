import { Button } from '@mui/material';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Carousel.scss';
import ScrollContainer from './ScrollContainer';
import ItemList from './ItemList';
import useGenericTagEndpoints from '../../hooks/generic-endpoints.hook';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { FlatTag, TagType, Thumbnail } from '../../types/additionalFlatTypes';
import { addNewParamToSearchPath } from '../views/search/helpers/addNewParamToSearchPath';
import useAdvancedSearch from '../views/search/helpers/useAdvancedSearch';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { asApiPath } from '../App';
import { SearchType } from '../views/search/helpers/search-filters';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
} from '../../graphql/APIConnector';

interface CategoryCarouselProps {
  title?: string;
  type: TagType;
  onClick: MouseEventHandler<HTMLButtonElement>;
  rows?: number;
  queryParams?: LocationTagFiltersInput | PersonTagFiltersInput | KeywordTagFiltersInput;
  seperator?: boolean;
}

const CategoryCarousel = ({
  title,
  type,
  onClick,
  rows,
  queryParams,
  seperator,
}: CategoryCarouselProps) => {
  const history: History = useHistory();

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

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';

  const { tagsWithThumbnailQuery } = useGenericTagEndpoints(type);

  const { data, loading, error, fetchMore } = tagsWithThumbnailQuery({
    variables: {
      filters: queryParams,
      start: 0,
      limit: rows ? rows * 3 : rows,
    },
  });

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='carousel-container'>
          {title && <h1 className='carousel-title'>{title}</h1>}
          {seperator && <hr className='carousel-seperator' />}
          <div className='carousel-collection-grid-container'>
            {flattenedTags && (
              <ItemList
                items={flattenedTags.slice(0, rows ? rowCount * rows : -1).map(tag => ({
                  name: tag.name,
                  background: tag.thumbnail.length
                    ? asApiPath(
                        String(tag.thumbnail[0].media?.formats?.small?.url || DEFAULT_THUMBNAIL_URL)
                      )
                    : DEFAULT_THUMBNAIL_URL,
                  onClick: () => {
                    const { searchPath } = addNewParamToSearchPath(
                      useAdvancedSearch ? type : SearchType.ALL,
                      encodeURIComponent(tag.name)
                    );
                    history.push(searchPath, {
                      showBack: true,
                    });
                  },
                }))}
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

export default CategoryCarousel;
