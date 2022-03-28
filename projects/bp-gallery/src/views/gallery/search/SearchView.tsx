import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import PictureScrollGrid from '../common/PictureScrollGrid';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
import { PictureFiltersInput } from '../../../graphql/APIConnector';

export const enum SearchType {
  DEFAULT = 'q',
  DECADE = 'decade',
  KEYWORD = 'keyword',
}

export const asSearchPath = (
  newParamType: SearchType,
  newParamValue: string,
  prevParams?: URLSearchParams
): string => {
  const searchParams = prevParams ? prevParams : new URLSearchParams();
  searchParams.append(newParamType, newParamValue);
  return `/search?${searchParams.toString()}`;
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

      filters.and?.push({
        time_range_tag: {
          start: {
            gte: startTime,
          },
          end: {
            lte: endTime,
          },
        },
      });
    }
  }

  if (searchParams.has(SearchType.KEYWORD)) {
    const keywords = searchParams.getAll(SearchType.KEYWORD).map(decodeURIComponent);
    keywords.forEach((keyword: string) => {
      filters.and?.push({
        keyword_tags: {
          name: {
            containsi: keyword,
          },
        },
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
  const { search }: Location = useLocation();

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
          />
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
