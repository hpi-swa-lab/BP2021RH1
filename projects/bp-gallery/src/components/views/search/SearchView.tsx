import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './SearchHub';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import SearchBreadcrumbs from './SearchBreadcrumbs';
import { convertSearchParamsToPictureFilters, paramToTime } from './helpers/search-filters';
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
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { TagType } from '../../../types/additionalFlatTypes';
import ScrollContainer from '../../common/ScrollContainer';
import NoSearchResultsText from './NoSearchResultsText';
import { isEmpty } from 'lodash';

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

export const asSearchPath = (searchParams: URLSearchParams): string => {
  return `/search?${searchParams.toString()}`;
};

const isValidYear = (searchRequest: string) => {
  return parseInt(searchRequest) && (searchRequest.length === 2 || searchRequest.length === 4);
};

const isValidTimeSpecification = (searchRequest: string) => {
  // Specification of year range e.g. '1970-1979'
  if (searchRequest.includes('-')) {
    // Trimming each year part makes it tolerant to multiple spaces between the '-'
    const yearParts = searchRequest.split('-').map(yearPart => yearPart.trim());
    return isValidYear(yearParts[0]) && isValidYear(yearParts[1]);
  }

  // Simple year specification e.g. '1972'
  return isValidYear(searchRequest);
};

export const addNewParamToSearchPath = (
  newParamType: string,
  searchRequest: string,
  prevParams?: URLSearchParams
): {
  isValid: boolean;
  searchPath: string;
} => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  const paramValues = searchRequest.split(' ');

  if (newParamType === SearchType.TIME_RANGE) {
    if (!isValidYear(searchRequest))
      return { searchPath: asSearchPath(searchParams), isValid: false };
  }

  paramValues.forEach(element => {
    if (!isDuplicatedSearchParam(element, newParamType, searchParams) && !isEmpty(element)) {
      searchParams.append(newParamType, element);
    }
  });
  return { searchPath: asSearchPath(searchParams), isValid: true };
};

const SearchView = () => {
  const [areResultsEmpty, setAreResultsEmpty] = useState<boolean>(false);
  const { search }: Location = useLocation();
  const { t } = useTranslation();

  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const customSearch = useMemo(() => searchParams.has(SearchType.ALL), [searchParams]);

  // Builds query from search params in the path
  const queryParams = useMemo(() => {
    if (customSearch) {
      const allSearchTerms = searchParams.getAll(SearchType.ALL).map(decodeURIComponent);
      const searchTimes: string[][] = [];
      allSearchTerms.forEach(searchTerm => {
        if (isValidTimeSpecification(searchTerm)) {
          const { startTime, endTime } = paramToTime(searchTerm);
          searchTimes.push([searchTerm, startTime, endTime]);
        }
      });
      return {
        searchTerms: allSearchTerms.filter(searchTerm => !isValidTimeSpecification(searchTerm)),
        searchTimes,
      };
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
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='search-content'>
          <div className='search-bar-container'>
            {' '}
            {(!areResultsEmpty || !search) && (
              <SearchBar searchParams={searchParams} customSearch={customSearch} />
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
            <div className='breadcrumb'>
              <SearchBreadcrumbs searchParams={searchParams} />
            </div>
          </div>
          {areResultsEmpty && search && <NoSearchResultsText searchParams={searchParams} />}
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
                setAreResultsEmpty(pictures <= 0);
              }}
            />
          )}
        </div>
      )}
    </ScrollContainer>
  );
};

export default SearchView;
