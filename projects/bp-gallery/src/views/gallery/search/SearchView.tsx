import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import SearchBreadcrumbs from './SearchBreadcrumbs';
import PictureScrollGrid from '../common/PictureScrollGrid';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
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
  DEFAULT = 'q',
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
): string => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  const paramValues = searchRequest.split(' ');

  paramValues.forEach(element => {
    if (!isDuplicatedSearchParam(element, newParamType, searchParams)) {
      searchParams.append(newParamType, element);
    }
  });
  return asSearchPath(searchParams);
};

export const convertSearchParamsToPictureFilters = (searchParams: URLSearchParams) => {
  const filters: PictureFiltersInput = { and: [], or: [] };

  //'baum'.toURLSearchParams();
  if (searchParams.has(SearchType.ALL)) {
    searchParams.forEach(function (value, key) {
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
    if (searchParams.get(SearchType.DECADE) === 'pre50') searchParams.set(SearchType.DECADE, '40');
    const decade = parseInt(searchParams.get(SearchType.DECADE) ?? '');

    if (!isNaN(decade)) {
      const startTime = decade === 40 ? '1900-01-01T00:00:00Z' : `19${decade}0-01-01T00:00:00Z`;
      const endTime = `19${decade}9-12-31T23:59:59Z`;

      const time_range_tag_filter = {
        start: {
          gte: startTime,
        },
        end: {
          lte: endTime,
        },
      };
      filters.and?.push({
        or: [
          {
            time_range_tag: time_range_tag_filter,
          },
          {
            verified_time_range_tag: time_range_tag_filter,
          },
        ],
      });
    }
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

  if (searchParams.has(SearchType.DEFAULT)) {
    const q = searchParams.getAll(SearchType.DEFAULT).map(decodeURIComponent);
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

const SearchView = ({ scrollPos, scrollHeight }: { scrollPos: number; scrollHeight: number }) => {
  const [searchSnippet, setSearchSnippet] = useState<string>('');
  const [previewPicture, setPreviewPicture] = useState<FlatPicture>();
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(true);
  const { search }: Location = useLocation();

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
      <div className='breadcrumb'>
        <SearchBreadcrumbs searchParams={searchParams} />
      </div>
      <div className='search-content'>
        <div className='below-search-bar'>
          <div>
            {' '}
            {(isSearchBarVisible || !search) && (
              <SearchBar
                onValueChange={(snippet?: string) => {
                  setSearchSnippet(snippet ?? '');
                }}
                searchParams={searchParams}
              />
            )}
            <SearchInfoTooltip
              title={
                <React.Fragment>
                  <Typography color='inherit'>Was passiert, wenn ich Stichworte suche?</Typography>
                  <p>
                    {'Jeder zusätzliche Suchbegriff schränkt die Suche weiter ein. Wenn du ohne zurückzugehen weitere\n' +
                      '                  Suchbegriffe eingibst, werden nur Bilder angezeigt, auf die alle bisherigen Suchbegriffe zutreffen.'}
                  </p>{' '}
                </React.Fragment>
              }
            >
              <Button />
            </SearchInfoTooltip>
          </div>

          {!search ? (
            <SearchHub searchSnippet={searchSnippet} />
          ) : (
            <PictureScrollGrid
              filters={filtersClause}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={search}
              previewPictureCallback={(pic: FlatPicture) => {
                if (pic !== previewPicture) {
                  setPreviewPicture(pic);
                }
              }}
              resultPictureCallback={(result: boolean) => {
                setIsSearchBarVisible(result);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
