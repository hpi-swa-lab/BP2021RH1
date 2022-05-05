import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import PictureScrollGrid from '../shared/PictureScrollGrid';
import SearchBreadcrumbs from './SearchBreadcrumbs';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
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

export const enum SearchType {
  DESCRIPTION = 'description',
  DECADE = 'decade',
  KEYWORD = 'keyword',
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

export const asSearchPath = (searchParams: URLSearchParams): string => {
  return `/search?${searchParams.toString()}`;
};

export const addNewParamToSearchPath = (
  newParamType: SearchType,
  searchRequest: string,
  prevParams?: URLSearchParams
): {
  isValid: boolean;
  searchVal: any;
} => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  const paramValues = searchRequest.split(' ');

  if (newParamType === SearchType.DECADE) {
    if (!(parseInt(searchRequest) && (searchRequest.length === 2 || searchRequest.length === 4)))
      return { searchVal: asSearchPath(searchParams), isValid: false };
  }

  paramValues.forEach(element => {
    if (!isDuplicatedSearchParam(element, newParamType, searchParams) && !element.includes(' ')) {
      searchParams.append(newParamType, element);
    }
  });
  return { searchVal: asSearchPath(searchParams), isValid: true };
};

export const convertSearchParamsToPictureFilters = (searchParams: URLSearchParams) => {
  const filters: PictureFiltersInput = { and: [], or: [] };

  if (searchParams.has(SearchType.ALL)) {
    const params = searchParams.getAll(SearchType.ALL).map(decodeURIComponent);
    params.forEach(function (value) {
      if (value === 'pre50') {
        value = '40';
      }

      const keyword = decodeURIComponent(value);
      const keyword_tag_filter = {
        name: {
          containsi: keyword,
        },
      };

      const q = decodeURIComponent(value);

      const value_number = parseInt(value);
      let time_range_tag_filter = {};
      if (!isNaN(value_number)) {
        if (value_number.toString().startsWith('19') && value_number.toString().length === 4) {
          const startTime = `19${parseInt(value_number.toString().substring(2))}-01-01T00:00:00Z`;
          const endTime = `19${parseInt(value_number.toString().substring(2))}-12-31T23:59:59Z`;

          time_range_tag_filter = {
            start: {
              gte: startTime,
            },
            end: {
              lte: endTime,
            },
          };
        } else if (value_number.toString().length === 2) {
          const startTime =
            value_number === 40 ? '1900-01-01T00:00:00Z' : `19${value_number}-01-01T00:00:00Z`;
          const endTime = `19${value_number}-12-31T23:59:59Z`;

          time_range_tag_filter = {
            start: {
              gte: startTime,
            },
            end: {
              lte: endTime,
            },
          };
        }
      }

      filters.and?.push({
        or: [
          {
            keyword_tags: keyword_tag_filter,
          },
          {
            verified_keyword_tags: keyword_tag_filter,
          },
          {
            descriptions: {
              text: {
                containsi: q,
              },
            },
          },
          {
            time_range_tag: time_range_tag_filter,
          },
          {
            verified_time_range_tag: time_range_tag_filter,
          },
        ],
      });
    });
  }
  if (searchParams.has(SearchType.DECADE)) {
    const timeParams = searchParams.getAll(SearchType.DECADE);
    timeParams.forEach(timeParam => {
      filters.and?.push(paramToTimefilter(timeParam) as PictureFiltersInput);
    });
  }

  if (searchParams.has(SearchType.KEYWORD)) {
    const keywords = searchParams.getAll(SearchType.KEYWORD).map(decodeURIComponent);
    keywords.forEach((keyword: string) => {
      const keyword_tag_filter = {
        name: {
          containsi: keyword,
        },
      };
      filters.and?.push({
        or: [
          {
            keyword_tags: keyword_tag_filter,
          },
          {
            verified_keyword_tags: keyword_tag_filter,
          },
        ],
      });
    });
  }

  if (searchParams.has(SearchType.DESCRIPTION)) {
    const q = searchParams.getAll(SearchType.DESCRIPTION).map(decodeURIComponent);
    q.forEach((param: string) => {
      filters.and?.push({
        descriptions: {
          text: {
            containsi: param,
          },
        },
      });
    });
  }

  return filters;
};

const paramToTimefilter = (timeParam: string) => {
  console.log(timeParam);
  // if (searchParams.get(SearchType.DECADE) === 'pre50') searchParams.set(SearchType.DECADE, '40');
  const year = parseInt(timeParam);

  if (!isNaN(year)) {
    let startTime = `${year}-01-01T00:00:00Z`;
    let endTime = `${year}-12-31T23:59:59Z`;
    if (year < 100) {
      startTime = year === 40 ? '1900-01-01T00:00:00Z' : `19${year}-01-01T00:00:00Z`;
      endTime = `19${year}-12-31T23:59:59Z`;
    }

    const time_range_tag_filter = {
      start: {
        gte: startTime,
      },
      end: {
        lte: endTime,
      },
    };

    return {
      or: [
        {
          time_range_tag: time_range_tag_filter,
        },
        {
          verified_time_range_tag: time_range_tag_filter,
        },
      ],
    };
  }
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
      </div>
    </div>
  );
};

export default SearchView;
