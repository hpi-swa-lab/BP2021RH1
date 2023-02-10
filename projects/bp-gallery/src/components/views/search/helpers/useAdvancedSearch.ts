const useAdvancedSearch =
  import.meta.env.VITE_REACT_APP_ADVANCED_SEARCH === 'true' ||
  import.meta.env.VITE_REACT_APP_ADVANCED_SEARCH === 'True';

export default useAdvancedSearch;
