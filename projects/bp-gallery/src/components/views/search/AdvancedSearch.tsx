import { SearchFilterInput } from './SearchFilterInput';

export const AdvancedSearch = () => {
  const ATTRIBUTES = [
    'keyword',
    'description',
    'comment',
    'person',
    'face-tag',
    'location',
    'collection',
    'archive',
    'timeRange',
  ];
  return (
    <div className='advanced-search'>
      <div className='advanced-search-content'>
        {ATTRIBUTES.map(attr => (
          <SearchFilterInput key={attr} attribute={attr}></SearchFilterInput>
        ))}
      </div>
    </div>
  );
};

export default AdvancedSearch;
