import React from 'react';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './SearchHub';
import { useSearchImagesQuery } from '../../../graphql/APIConnector';
import PictureGrid from '../common/PictureGrid';
import { apiBase } from '../../../App';

const DEFAULT_SEARCH_BANNER_PICTURE = '1_1972_Winter04_747f834344.jpg';
const DEFAULT_PICTURE_GRID_HASH_BASE = 'Werner';

const SearchView = ({ params, scrollPos }: { params?: string[]; scrollPos: number }) => {
  const { data, loading } = useSearchImagesQuery({
    variables: {
      text: params ? params[params.length - 1] : '',
    },
  });

  let pics: any[] = [];

  if (data?.pictures && !loading) {
    pics = data.pictures;
  }

  return (
    <div className='search-view'>
      {params && params.length > 0 && (
        <div className='search-result-banner'>
          <div className='search-result-banner-background'>
            <img
              style={{ transform: `translateY(${scrollPos * 0.5}px)` }}
              src={`${apiBase}/uploads/${DEFAULT_SEARCH_BANNER_PICTURE}`}
              alt={DEFAULT_SEARCH_BANNER_PICTURE}
            />
          </div>
          <div className='search-result-breadcrumbs'>
            {params.map((crumb: string) => {
              return (
                <div key={crumb} className='breadcrumb'>
                  {crumb}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className='search-content'>
        <SearchBar />
        <div className='below-search-bar'>
          {loading || (!params?.length && <SearchHub />)}
          {!loading && data && params?.length && (
            <PictureGrid pictures={pics} hashBase={DEFAULT_PICTURE_GRID_HASH_BASE} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
