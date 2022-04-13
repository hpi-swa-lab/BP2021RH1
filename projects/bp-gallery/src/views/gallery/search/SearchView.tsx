import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { History, Location } from 'history';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import PictureScrollGrid from '../shared/PictureScrollGrid';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
import {
  Button,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  Chip,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const enum SearchType {
  DEFAULT = 'q',
  DECADE = 'decade',
  KEYWORD = 'keyword',
}

const filterDuplicateSearchParams = (element: string, prevParams: URLSearchParams): boolean => {
  const prevValues = prevParams.getAll('q');
  let r = false;
  prevValues.forEach(e => {
    if (element === e) r = true;
  });
  return r;
};

export const asSearchPath = (searchParams: URLSearchParams): string => {
  return `/search?${searchParams.toString()}`;
};

export const addNewParamToSearchPath = (
  newParamType: SearchType,
  newParamValue: string,
  prevParams?: URLSearchParams
): string => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  const paramValues = newParamValue.split(' ');
  paramValues.forEach(element => {
    if (!filterDuplicateSearchParams(element, searchParams)) {
      searchParams.append(newParamType, element);
    }
  });
  return asSearchPath(searchParams);
};

export const convertSearchParamsToPictureFilters = (searchParams: URLSearchParams) => {
  const filters: PictureFiltersInput = { and: [] };

  if (searchParams.has(SearchType.DECADE)) {
    if (searchParams.get(SearchType.DECADE) === 'pre50') searchParams.set(SearchType.DECADE, '40');
    const decade = parseInt(searchParams.get(SearchType.DECADE) ?? '');

    if (!isNaN(decade)) {
      const startTime =
        decade === 40 ? '1900-01-01T00:00:00Z' : `19${decade / 10}0-01-01T00:00:00Z`;
      const endTime = `19${decade / 10}9-12-31T23:59:59Z`;

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
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(true);
  const history: History = useHistory();
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

  const searchParamValues: string[] = [];
  searchParams.forEach(element => {
    searchParamValues.push(element.toString());
  });

  const deleteParam = (deleteValue: string) => {
    const params = searchParams.getAll('q');
    const remainingParams = params.filter(el => el !== deleteValue);
    const newSearchParams = new URLSearchParams();
    remainingParams.forEach(el => newSearchParams.append(SearchType.DEFAULT, el));
    history.push(asSearchPath(newSearchParams), {
      showBack: true,
    });
  };

  return (
    <div className='search-view'>
      <div className='breadcrumb'>
        {searchParamValues.map((el, idx) => {
          return <Chip key={idx} label={el} onDelete={event => deleteParam(el)} />;
        })}
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
              <Button>HTML</Button>
            </SearchInfoTooltip>
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
