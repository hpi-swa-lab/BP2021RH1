import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
  PictureFiltersInput,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import useGetTagsWithThumbnail from '../../../hooks/get-tags-with-thumbnail.hook';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import ItemList from '../../common/ItemList';
import Loading from '../../common/Loading';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollableItemList from '../../common/ScrollableItemList';
import { useVisit } from './../../../helpers/history';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';
import { SearchType } from './helpers/search-filters';
import useAdvancedSearch from './helpers/useAdvancedSearch';
import './TagList.scss';

const TagList = ({
  type,
  scroll = true,
  onClickBasePath,
  elementsPerRow,
  currentItemAmount,
  queryParams,
  thumbnailQueryParams,
}: {
  type: TagType;
  scroll?: boolean;
  onClickBasePath?: string;
  elementsPerRow?: number;
  currentItemAmount?: number;
  queryParams?: LocationTagFiltersInput | PersonTagFiltersInput | KeywordTagFiltersInput;
  thumbnailQueryParams?: PictureFiltersInput;
}) => {
  const { visit } = useVisit();
  const { t } = useTranslation();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';
  const MAX_ROWS_WITHOUT_FOLDING = 3;

  const { data, loading, error, fetchMore } = useGetTagsWithThumbnail(
    queryParams,
    thumbnailQueryParams,
    false,
    type,
    ['name:asc'],
    currentItemAmount ?? (scroll ? 30 : undefined)
  );

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

  const fetchMoreOnScroll = useCallback(
    (count: number) => {
      // Generic endpoint results to type issues with fetchMore
      //@ts-ignore
      fetchMore({
        variables: {
          start: flattenedTags?.length,
          limit: count,
        },
      });
    },
    [fetchMore, flattenedTags]
  );

  const isFoldable = Boolean(
    flattenedTags &&
      elementsPerRow &&
      flattenedTags.length > MAX_ROWS_WITHOUT_FOLDING * elementsPerRow &&
      !currentItemAmount
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(!isFoldable);
  }, [isFoldable]);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (flattenedTags?.length) {
    if (scroll) {
      return (
        <ScrollableItemList
          compact={true}
          fetchMoreOnScroll={fetchMoreOnScroll}
          items={flattenedTags.map(tag => ({
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
              visit(searchPath);
            },
          }))}
        />
      );
    } else if (onClickBasePath) {
      return (
        <>
          <div className={`item-list-container ${isOpen ? 'open' : 'closed'}`}>
            <ItemList
              items={(currentItemAmount
                ? flattenedTags.slice(0, currentItemAmount)
                : flattenedTags
              ).map(tag => ({
                name: tag.name,
                background: tag.thumbnail.length
                  ? asApiPath(
                      String(tag.thumbnail[0].media?.formats?.small?.url || DEFAULT_THUMBNAIL_URL)
                    )
                  : DEFAULT_THUMBNAIL_URL,
                onClick: () => {
                  visit(onClickBasePath + tag.id);
                },
              }))}
            />
          </div>
          {isFoldable && (
            <IconButton
              className='icon-button'
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              {isOpen ? (
                <KeyboardArrowUp className='icon' />
              ) : (
                <KeyboardArrowDown className='icon' />
              )}
            </IconButton>
          )}
        </>
      );
    } else return <div>{t('something-went-wrong')}</div>;
  } else return <div>{t('something-went-wrong')}</div>;
};

export default TagList;
