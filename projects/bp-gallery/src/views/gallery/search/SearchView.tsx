import React, { useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import PictureScrollGrid from '../common/PictureScrollGrid';
import dayjs from 'dayjs';
import { Picture } from '../../../graphql/APIConnector';
import { Location } from 'history';
import { useLocation } from 'react-router-dom';

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

const SearchView = ({ scrollPos, scrollHeight }: { scrollPos: number; scrollHeight: number }) => {
  const [searchSnippet, setSearchSnippet] = useState<string>('');
  const [previewPicture, setPreviewPicture] = useState<Picture>();
  const { search }: Location = useLocation();

  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  //Builds query from search params in the path
  const whereClause = useMemo(() => {
    const where: { [key: string]: any } = {};

    //TODO: Change definition of where clause here when implementing nested search

    if (searchParams.has(SearchType.DECADE)) {
      if (searchParams.get(SearchType.DECADE) === 'pre50')
        searchParams.set(SearchType.DECADE, '40');
      const decade = parseInt(searchParams.get(SearchType.DECADE) ?? '');

      if (!isNaN(decade)) {
        let startTime;
        if (decade === 40) {
          startTime = new Date(`1900-01-01`);
        } else {
          startTime = new Date(`19${decade / 10}0-01-01`);
        }
        const endTime = new Date(`19${decade / 10}9-12-31`);
        where['time_range_tag'] = {
          start_gte: dayjs(startTime).format('YYYY-MM-DDTHH:mm'),
          end_lte: dayjs(endTime).format('YYYY-MM-DDTHH:mm'),
        };
      }
    }

    if (searchParams.has(SearchType.KEYWORD)) {
      const keywords = searchParams.getAll(SearchType.KEYWORD);
      where['keyword_tags'] = { name_contains: keywords[0] };
    }

    if (searchParams.has(SearchType.DEFAULT)) {
      const q = searchParams.getAll(SearchType.DEFAULT);
      where['descriptions'] = { text_contains: q[0] };
    }

    return where;
  }, [searchParams]);

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
          {!location.search ? (
            <SearchHub searchSnippet={searchSnippet} />
          ) : (
            <PictureScrollGrid
              where={whereClause}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={search}
              previewPictureCallback={(pic: Picture) => {
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
