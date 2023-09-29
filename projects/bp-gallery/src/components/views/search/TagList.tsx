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
import { asUploadPath } from '../../../helpers/app-helpers';
import useGetTagsWithThumbnail from '../../../hooks/get-tags-with-thumbnail.hook';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import ItemList from '../../common/ItemList';
import Loading from '../../common/Loading';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollableItemList from '../../common/ScrollableItemList';
import { useVisit } from './../../../helpers/history';
import './TagList.scss';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';
import { SearchType } from './helpers/search-filters';
import useAdvancedSearch from './helpers/useDeprecatedAdvancedSearch';

const TagList = ({
  type,
  scroll = true,
  onClickBasePath,
  elementsPerRow,
  currentItemAmount,
  queryParams,
  thumbnailQueryParams,
  allowFold = true,
}: {
  type: TagType;
  scroll?: boolean;
  onClickBasePath?: string;
  elementsPerRow?: number;
  currentItemAmount?: number;
  queryParams?: LocationTagFiltersInput | PersonTagFiltersInput | KeywordTagFiltersInput;
  thumbnailQueryParams?: PictureFiltersInput;
  allowFold?: boolean;
}) => {
  const { visit, location } = useVisit();
  const { t } = useTranslation();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';
  const MAX_ROWS_WITHOUT_FOLDING = 3;

  const { data, loading, error, fetchMore } = useGetTagsWithThumbnail(
    queryParams,
    thumbnailQueryParams,
    type,
    ['name:asc'],
    currentItemAmount ?? (scroll ? 30 : undefined)
  );

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: (FlatTag & { thumbnail?: Thumbnail[] })[] | undefined = flattened
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
    allowFold &&
      flattenedTags &&
      elementsPerRow &&
      flattenedTags.length > MAX_ROWS_WITHOUT_FOLDING * elementsPerRow &&
      !currentItemAmount
  );

  const [isOpen, setIsOpen] = useState<boolean>(location.state?.open ?? false);

  useEffect(() => {
    setIsOpen(!isFoldable);
  }, [isFoldable]);

  useEffect(() => {
    if (location.state?.open) setIsOpen(location.state.open);
  }, [location]);

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
            background: asUploadPath(tag.thumbnail?.[0]?.media, {
              highQuality: false,
              fallback: DEFAULT_THUMBNAIL_URL,
            }),
            onClick: () => {
              const { searchPath } = addNewParamToSearchPath(
                useAdvancedSearch ? type : SearchType.ALL,
                encodeURIComponent(tag.name)
              );
              visit(searchPath, { wasOpen: true });
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
                background: asUploadPath(tag.thumbnail?.[0]?.media, {
                  highQuality: false,
                  fallback: DEFAULT_THUMBNAIL_URL,
                }),
                onClick: () => {
                  visit(onClickBasePath + tag.id, { wasOpen: true });
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
