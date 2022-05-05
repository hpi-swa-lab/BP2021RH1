import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import PictureScrollGrid from '../shared/PictureScrollGrid';
import { PictureFiltersInput } from '../../../graphql/APIConnector';

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
  const { search }: Location = useLocation();
  const [isValidSearch, setIsValidSearch] = useState<boolean>(true);

  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  // Builds query from search params in the path
  const filtersClause = useMemo(
    () => convertSearchParamsToPictureFilters(searchParams),
    [searchParams]
  );

  return (
    <div className='search-view'>
      <div className='search-content'>
        <div className='below-search-bar'>
          <SearchBar
            onValueChange={(snippet?: string) => {
              setSearchSnippet(snippet ?? '');
            }}
            searchParams={searchParams}
            onInvalidEntry={(value: boolean) => {
              setIsValidSearch(value);
            }}
          />
          {!search ? (
            <SearchHub searchSnippet={searchSnippet} />
          ) : (
            <PictureScrollGrid
              filters={filtersClause}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={search}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
