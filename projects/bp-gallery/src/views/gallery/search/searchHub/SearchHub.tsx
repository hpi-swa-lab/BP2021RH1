import React from 'react';
import { useTranslation } from 'react-i18next';
import KeywordTagsSearchList from './KeywordTagsSearchList';
import DecadesList from './DecadesList';

const SearchHub = ({ searchSnippet }: { searchSnippet: string }) => {
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
      </div>
    </div>
  );
};

export default SearchHub;
