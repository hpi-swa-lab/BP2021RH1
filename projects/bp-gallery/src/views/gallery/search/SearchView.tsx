import React from 'react';
import SearchBar from './SearchBar';
import './SearchView.scss';

const SearchView = (params: any) => {
  return (
    <div className='search-view'>
      <SearchBar />
      {/* <div className='search-section'>
        <h3>VORSCHLÄGE</h3>
        <ItemList compact={true} />
      </div>

      <div className='search-section'>
        <h3>ORTE</h3>
        <ItemList compact={true} />
      </div>

      <div className='search-section'>
        <h3>PERSONEN</h3>
        <ItemList compact={true} />
      </div>

      <div className='search-section'>
        <h3>JAHRZEHNTE</h3>
        <ItemList compact={true} />
      </div> */}
    </div>
  );
};

export default SearchView;
