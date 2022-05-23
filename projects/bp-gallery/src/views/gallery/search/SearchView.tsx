import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import PictureScrollGrid from '../shared/PictureScrollGrid';
import SearchBreadcrumbs from './SearchBreadcrumbs';
import { convertSearchParamsToPictureFilters } from './helpers/search-filters';
import {
  Button,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useBulkOperations from '../shared/bulk-operations';
import { TagType } from '../../../types/additionalFlatTypes';

export const SearchType = {
  ...TagType,
  DESCRIPTION: 'description',
  DECADE: 'decade',
  ALL: 'all',
};

const isDuplicatedSearchParam = (
  element: string,
  type: string,
  prevParams: URLSearchParams
): boolean => {
  let isDuplicate = false;
  const prevParamsIterator = prevParams.entries();
  let nextParam = prevParamsIterator.next();
  while (!nextParam.done) {
    if (nextParam.value[1] === element && nextParam.value[0] === type) isDuplicate = true;
    nextParam = prevParamsIterator.next();
  }

  return isDuplicate;
};

const isSpace = (element: string): boolean => {
  let isSpace = false;
  if (element === '') {
    isSpace = true;
  }
  return isSpace;
};

export const asSearchPath = (searchParams: URLSearchParams): string => {
  return `/search?${searchParams.toString()}`;
};

export const addNewParamToSearchPath = (
  newParamType: string,
  searchRequest: string,
  prevParams?: URLSearchParams
): {
  isValid: boolean;
  searchVal: string;
} => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  const paramValues = searchRequest.split(' ');

  if (newParamType === SearchType.TIME_RANGE) {
    if (!(parseInt(searchRequest) && (searchRequest.length === 2 || searchRequest.length === 4)))
      return { searchVal: asSearchPath(searchParams), isValid: false };
  }

  paramValues.forEach(element => {
    if (!isDuplicatedSearchParam(element, newParamType, searchParams) && !isSpace(element)) {
      searchParams.append(newParamType, element);
    }
  });
  return { searchVal: asSearchPath(searchParams), isValid: true };
};

const SearchView = ({ scrollPos, scrollHeight }: { scrollPos: number; scrollHeight: number }) => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(true);
  const [isValidSearch, setIsValidSearch] = useState<boolean>(true);
  const { search }: Location = useLocation();
  const { t } = useTranslation();

  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const customSearch = useMemo(() => searchParams.has(SearchType.ALL), [searchParams]);

  // Builds query from search params in the path
  const queryParams = useMemo(() => {
    if (customSearch) {
      return searchParams.getAll(SearchType.ALL);
    }
    return convertSearchParamsToPictureFilters(searchParams);
  }, [customSearch, searchParams]);

  const SearchInfoTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }}>
      <IconButton className={'info-icon'}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 220,

      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  const { linkToCollection } = useBulkOperations();

  return (
    <div className='search-view'>
      <div className='search-content'>
        <div className='below-search-bar'>
          <div className='search-bar-container'>
            {' '}
            {(isSearchBarVisible || !search) && (
              <SearchBar
                searchParams={searchParams}
                onSetIsValidSearch={(value: boolean) => {
                  setIsValidSearch(value);
                }}
                customSearch={customSearch}
              />
            )}
            <SearchInfoTooltip
              title={
                <>
                  <Typography color='inherit'>{t('search.question')}</Typography>
                  <p>{t('search.help')}</p>
                </>
              }
            >
              <Button />
            </SearchInfoTooltip>
            {!isValidSearch && <div>{t('search.wrong-time-input-info')}</div>}
            <div className='breadcrumb'>
              <SearchBreadcrumbs searchParams={searchParams} />
            </div>
          </div>
        </div>
        {!search ? (
          <SearchHub />
        ) : (
          <PictureScrollGrid
            queryParams={queryParams}
            customSearch={customSearch}
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={search}
            bulkOperations={[linkToCollection]}
            resultPictureCallback={(pictures: number) => {
              setIsSearchBarVisible(pictures > 0);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchView;
