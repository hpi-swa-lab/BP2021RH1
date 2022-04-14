import React from 'react';
import { useTranslation } from 'react-i18next';
import KeywordTagsSearchList from './KeywordTagsSearchList';
import DecadesList from './DecadesList';
import BrowseView from '../../browse/BrowseView';
import LocationTagsList from './LocationTagsList';

const SearchHub = ({ searchSnippet }: { searchSnippet: string }, communityView: boolean) => {
  const { t } = useTranslation();

  return (
    <div className='search-hub'>
      <div className='search-section'>
        <h3>{t('common.suggestions').toUpperCase()}</h3>
        <KeywordTagsSearchList searchSnippet={searchSnippet} />
      </div>
      <div className='search-section'>
        <h3>{t('common.decades').toUpperCase()}</h3>
        <DecadesList />
        <div className='search-section'>
          <h3>{t('common.locations').toUpperCase()}</h3>
          <LocationTagsList />
        </div>
        <div className='search-section'>
          <BrowseView path={[]} scrollPos={0} scrollHeight={0} communityView={communityView} />
        </div>
      </div>
    </div>
  );
};

export default SearchHub;
