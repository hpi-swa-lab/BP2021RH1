const useAdvancedSearch =
  process.env.REACT_APP_ADVANCED_SEARCH === 'true' ||
  process.env.REACT_APP_ADVANCED_SEARCH === 'True';

export default useAdvancedSearch;
