import React from 'react';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './SearchHub';
import { useSearchImagesQuery } from '../../../graphql/APIConnector';
import PictureGrid from '../common/PictureGrid';

const SearchView = ({ params, scrollPos }: { params?: string[]; scrollPos: number }) => {
  const { data, loading, error } = useSearchImagesQuery({
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
              src='https://bp.bad-harzburg-stiftung.de/api//uploads/1_1972_Winter04_747f834344.jpg'
            ></img>
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
            <PictureGrid pictures={pics} hashBase={'Werner'} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
