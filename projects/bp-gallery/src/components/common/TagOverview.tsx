import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import './PictureOverview.scss';
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
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import useGetTagsWithThumbnail from '../../hooks/get-tags-with-thumbnail.hook';
import PrimaryButton from './PrimaryButton';

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
  const ref = useRef<any>();

  const basePath = archiveId
    ? '/archives/' + archiveId + '/show-more/' + type + '/'
    : '/show-more/' + type + '/';

  const calculateMaxCategoriesPerRow = useCallback((width: number) => {
    const tempRowLength = Math.max(1, Math.floor(Math.min(width, 1200) / 260));
    if (Math.min(width, 1200) >= tempRowLength * 260 + (tempRowLength - 1) * 8) {
      return tempRowLength;
    }
    return Math.max(1, tempRowLength - 1);
  }, []);

  const [rowLength, setRowLength] = useState(() => {
    return calculateMaxCategoriesPerRow((ref.current?.clientWidth ?? 0) as number);
  });

  const onResize = useCallback(() => {
    setRowLength(calculateMaxCategoriesPerRow((ref.current?.clientWidth ?? 0) as number));
  }, [calculateMaxCategoriesPerRow]);

  //ensure correct set up of
  useEffect(() => {
    setRowLength(calculateMaxCategoriesPerRow((ref.current?.clientWidth ?? 0) as number));
  }, [ref.current?.clientWidth, calculateMaxCategoriesPerRow]);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const { data } = useGetTagsWithThumbnail(
    queryParams,
    thumbnailQueryParams,
    false,
    type,
    ['name:asc'],
    1
  );

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

  if (flattenedTags?.length === 0 && type !== TagType.TIME_RANGE) {
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
          <PrimaryButton onClickFn={onClick} isShowMore={true}>
            {t('common.showMore')}
          </PrimaryButton>
        )}
      </div>
    );
  }
};

export default TagOverview;
