import React, { useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './searchHub/SearchHub';
import PictureScrollGrid from '../common/PictureScrollGrid';
import dayjs from 'dayjs';
import { Picture } from '../../../graphql/APIConnector';
import SearchResultBanner from './SearchResultBanner';

export interface SearchParam {
  value: string;
  type: SearchType;
}

export const enum SearchType {
  DEFAULT = '',
  DECADE = 'decade',
  KEYWORD = 'keyword',
}

export const asSearchPath = (params: SearchParam[]): string => {
  const paramsFormatted = params
    .map(
      (param: SearchParam) =>
        (param.type === SearchType.DEFAULT ? '/' : `/${param.type}=`) + param.value
    )
    .join('');
  return `/search${paramsFormatted}`;
};

const SearchView = ({
  params,
  scrollPos,
  scrollHeight,
}: {
  params?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const [searchSnippet, setSearchSnippet] = useState<string>('');
  const [previewPicture, setPreviewPicture] = useState<Picture>();

  const searchParams = useMemo(
    () =>
      params?.map((param: string) => {
        if (param.includes('=')) {
          const typeStr = param.substr(0, param.indexOf('='));
          let value = param.substr(param.indexOf('=') + 1);
          let type = SearchType.DEFAULT;
          //Reverse-mapping of enum:
          switch (typeStr) {
            case 'decade':
              type = SearchType.DECADE;
              break;
            case 'keyword':
              type = SearchType.KEYWORD;
              break;
            default:
              value = param;
              break;
          }
          return { value, type };
        } else {
          return { value: param, type: SearchType.DEFAULT };
        }
      }) ?? [],
    [params]
  );

  //Builds query from search params in the path
  const whereClause = useMemo(() => {
    console.log(searchParams);
    const where: { [key: string]: any } = {};

    //TODO: Change definition of where clause here when implementing nested search
    searchParams.map((param: SearchParam) => {
      switch (param.type) {
        case SearchType.DECADE:
          if (!isNaN(parseInt(param.value))) {
            const decade = parseInt(param.value);
            const startTime = new Date(`19${decade / 10}0-01-01`);
            const endTime = new Date(`19${decade / 10}9-12-31`);
            where['time_range_tag'] = {
              start_gte: dayjs(startTime).format('YYYY-MM-DDTHH:mm'),
              end_lte: dayjs(endTime).format('YYYY-MM-DDTHH:mm'),
            };
          }
          break;
        case SearchType.KEYWORD:
          where['keyword_tags'] = { name_contains: param.value };
          break;
        default:
          where['descriptions'] = { text_contains: param.value };
          break;
      }
    });

    return where;
  }, [searchParams]);

  return (
    <div className='search-view'>
      {searchParams.length > 0 && previewPicture && (
        <SearchResultBanner
          scrollPos={scrollPos}
          searchParams={searchParams}
          previewPicture={previewPicture}
        />
      )}
      <div className='search-content'>
        <div className='below-search-bar'>
          <SearchBar
            onValueChange={(snippet?: string) => {
              setSearchSnippet(snippet ?? '');
            }}
            searchParams={searchParams}
          />
          {!searchParams.length ? (
            <SearchHub searchSnippet={searchSnippet} />
          ) : (
            <PictureScrollGrid
              where={whereClause}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={searchParams[0].value}
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
