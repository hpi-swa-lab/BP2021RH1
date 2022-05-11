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

export const enum SearchType {
  DESCRIPTION = 'description',
  DECADE = 'decade',
  KEYWORD = 'keyword',
  PERSON = 'person',
  LOCATION = 'location',
  ALL = 'ALL',
}

const isDuplicatedSearchParam = (
  element: string,
  type: string,
  prevParams: URLSearchParams
): boolean => {
  let r = false;
  const prevParamsIterator = prevParams.entries();
  let nextParam = prevParamsIterator.next();
  while (!nextParam.done) {
    if (nextParam.value[1] === element && nextParam.value[0] === type) r = true;
    nextParam = prevParamsIterator.next();
  }

  return r;
};

const isSpace = (element: string): boolean => {
  let r = false;
  console.log(element);
  if (element === '') {
    r = true;
  }
  return r;
};

export const asSearchPath = (searchParams: URLSearchParams): string => {
  return `/search?${searchParams.toString()}`;
};

export const addNewParamToSearchPath = (
  newParamType: SearchType,
  searchRequest: string,
  prevParams?: URLSearchParams
): {
  isValid: boolean;
  searchVal: string;
} => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  const paramValues = searchRequest.split(' ');

  if (newParamType === SearchType.DECADE) {
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
  const [searchSnippet, setSearchSnippet] = useState<string>('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(true);
  const [isValidSearch, setIsValidSearch] = useState<boolean>(true);
  const { search }: Location = useLocation();
  const { t } = useTranslation();

  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  // Builds query from search params in the path
  const filtersClause = useMemo(
    () => convertSearchParamsToPictureFilters(searchParams),
    [searchParams]
  );

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
                onValueChange={(snippet?: string) => {
                  setSearchSnippet(snippet ?? '');
                }}
                searchParams={searchParams}
                onInvalidEntry={(value: boolean) => {
                  setIsValidSearch(value);
                }}
              />
            )}
            <SearchInfoTooltip
              title={
                <React.Fragment>
                  <Typography color='inherit'>{t('search.question')}</Typography>
                  <p>{t('search.help')}</p>
                </React.Fragment>
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
          <SearchHub searchSnippet={searchSnippet} />
        ) : (
          <PictureScrollGrid
            filters={filtersClause}
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={search}
            resultPictureCallback={(result: boolean) => {
              setIsSearchBarVisible(result);
            }}
          />
        )}
        {!search ? (
          <SearchHub searchSnippet={searchSnippet} />
        ) : (
          <PictureScrollGrid
            filters={filtersClause}
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={search}
            bulkOperations={[linkToCollection]}
          />
        )}
      </div>
    </div>
  );
};

export default SearchView;
