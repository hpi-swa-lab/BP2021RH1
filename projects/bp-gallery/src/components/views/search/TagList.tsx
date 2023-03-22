import { useCallback, useEffect, useState } from 'react';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import Loading from '../../common/Loading';
import ScrollableItemList from '../../common/ScrollableItemList';
import { asApiPath } from '../../../helpers/app-helpers';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import useAdvancedSearch from './helpers/useAdvancedSearch';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';
import { SearchType } from './helpers/search-filters';
import ItemList from '../../common/ItemList';
import {
  KeywordTagFiltersInput,
  LocationTagFiltersInput,
  PersonTagFiltersInput,
  PictureFiltersInput,
} from '../../../graphql/APIConnector';
import useGetTagsWithThumbnail from '../../../hooks/get-tags-with-thumbnail.hook';
import './TagList.scss';
import { IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

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
  const history: History = useHistory();
  const { t } = useTranslation();

  const DEFAULT_THUMBNAIL_URL = '/bad-harzburg-stiftung-logo.png';

  const { data, loading, error, fetchMore } = useGetTagsWithThumbnail(
    queryParams,
    thumbnailQueryParams,
    false,
    type,
    ['name:asc'],
    currentItemAmount ?? scroll ? 30 : undefined
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

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(
      flattenedTags &&
        elementsPerRow &&
        flattenedTags.length > 3 * elementsPerRow &&
        !currentItemAmount
        ? false
        : true
    );
  }, [flattenedTags, elementsPerRow, currentItemAmount]);

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
              history.push(searchPath, {
                showBack: true,
              });
            },
          }))}
        />
      );
    } else if (onClickBasePath) {
      return (
        <>
          <div className={isOpen ? 'open' : 'closed'}>
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
                  history.push(onClickBasePath + tag.id, {
                    showBack: true,
                  });
                },
              }))}
            />
          </div>
          {!currentItemAmount && elementsPerRow && flattenedTags.length > 3 * elementsPerRow && (
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
