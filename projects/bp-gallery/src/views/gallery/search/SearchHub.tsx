import React from 'react';
import { useTranslation } from 'react-i18next';
import ItemList from '../common/ItemList';

const DEFAULT_SECTION_ITEMS = Array(10)
  .fill(0)
  .map((_, i) => ({
    name: `Item ${i}`,
    color: '#7E241D',
    background: '/bad-harzburg-stiftung-logo.png',
  }));

const SearchHub = () => {
  const { t } = useTranslation();

  const defaultItemList = <ItemList compact={true} items={DEFAULT_SECTION_ITEMS} />;

  return (
    <div className='search-hub'>
      <div className='search-section'>
        <h3>{t('common.suggestions').toUpperCase()}</h3>
        {defaultItemList}
      </div>

      <div className='search-section'>
        <h3>{t('common.locations').toUpperCase()}</h3>
        {defaultItemList}
      </div>

      <div className='search-section'>
        <h3>{t('common.persons').toUpperCase()}</h3>
        {defaultItemList}
      </div>

      <div className='search-section'>
        <h3>{t('common.decades').toUpperCase()}</h3>
        {defaultItemList}
      </div>
    </div>
  );
};

export default SearchHub;
