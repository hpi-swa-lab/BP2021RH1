import { ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
  PictureFiltersInput,
} from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import useGetTagsWithThumbnail from '../../hooks/get-tags-with-thumbnail.hook';
import { FlatTag, TagType, Thumbnail } from '../../types/additionalFlatTypes';
import DecadesList from '../views/search/DecadesList';
import TagList from '../views/search/TagList';
import Loading from './Loading';
import './PictureOverview.scss';
import QueryErrorDisplay from './QueryErrorDisplay';

const MAX_TAGS_PER_ROW = 3;

interface TagOverviewProps {
  title?: string;
  type: TagType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  rows?: number;
  queryParams?: LocationTagFiltersInput | PersonTagFiltersInput | KeywordTagFiltersInput;
  thumbnailQueryParams?: PictureFiltersInput;
  archiveId?: string;
}

const TagOverview = ({
  title,
  type,
  onClick,
  rows,
  queryParams,
  thumbnailQueryParams,
  archiveId,
}: TagOverviewProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);

  const basePath = archiveId
    ? '/archives/' + archiveId + '/show-more/' + type + '/'
    : '/show-more/' + type + '/';

  const calculateMaxCategoriesPerRow = useCallback((width: number) => {
    const tempRowLength = Math.max(1, Math.floor(Math.min(width, 1200) / 260));
    if (Math.min(width, 1200) >= tempRowLength * 260 + (tempRowLength - 1) * 8) {
      return Math.min(tempRowLength, MAX_TAGS_PER_ROW);
    }
    return Math.min(Math.max(1, tempRowLength - 1), MAX_TAGS_PER_ROW);
  }, []);

  const [rowLength, setRowLength] = useState(() => {
    return calculateMaxCategoriesPerRow(ref.current?.clientWidth ?? 0);
  });

  const onResize = useCallback(() => {
    setRowLength(calculateMaxCategoriesPerRow(ref.current?.clientWidth ?? 0));
  }, [calculateMaxCategoriesPerRow]);

  //ensure correct set up of
  useEffect(() => {
    setRowLength(calculateMaxCategoriesPerRow(ref.current?.clientWidth ?? 0));
  }, [ref.current?.clientWidth, calculateMaxCategoriesPerRow]);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  // check if there is a tag
  const { data, loading, error } = useGetTagsWithThumbnail(
    queryParams,
    thumbnailQueryParams,
    type,
    ['name:asc'],
    1,
    'no-cache'
  );

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (flattenedTags?.length === 0 && type !== TagType.TIME_RANGE) {
    return <div></div>;
  } else {
    return (
      <div className='overview-container' ref={ref}>
        {title && <h2 className='overview-title'>{title}</h2>}
        <div className='overview-collection-grid-container'>
          {type !== TagType.TIME_RANGE ? (
            <TagList
              type={type}
              scroll={false}
              onClickBasePath={basePath}
              elementsPerRow={rowLength}
              currentItemAmount={rows ? rowLength * rows : undefined}
              queryParams={queryParams}
              thumbnailQueryParams={thumbnailQueryParams}
            />
          ) : (
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
            className='w-fit self-center'
            variant='contained'
            onClick={onClick}
            endIcon={<ArrowForwardIos />}
          >
            {t('common.showMore')}
          </Button>
        )}
      </div>
    );
  }
};

export default TagOverview;
