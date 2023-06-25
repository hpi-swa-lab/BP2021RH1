import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext, AlertType } from '../../provider/AlertProvider';
import { useVisit } from './../../../helpers/history';
import './SearchBar.scss';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';
import { SearchType } from './helpers/search-filters';
import { getSearchTypeTranslation } from './helpers/search-translation';
import { fromURLSearchParam } from './helpers/url-search-params';
import useAdvancedSearch from './helpers/useDeprecatedAdvancedSearch';

const SearchBar = ({
  searchParams,
  isAllSearchActive,
  isTopBarSearch,
}: {
  searchParams: URLSearchParams;
  isAllSearchActive: boolean;
  isTopBarSearch?: boolean;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();
  const openAlert = useContext(AlertContext);
  const textFieldRef = useRef<any>();
  const [searchType, setSearchType] = useState<string>(SearchType.ALL);

  const typeOfLatestSearch = useMemo(() => {
    const types = Array.from(searchParams.keys());
    const type = types[types.length - 1] as string | undefined;
    return type === undefined ? type : fromURLSearchParam(type);
  }, [searchParams]);

  useEffect(() => {
    if (typeOfLatestSearch) {
      let nextSearchType;
      switch (typeOfLatestSearch) {
        case SearchType.DECADE:
          // If a decade was searched, it does not make sense to further intersect with another decade.
          nextSearchType = SearchType.TIME_RANGE;
          break;
        case SearchType.ARCHIVE:
          // A picture can only have one archive tag, is does make sense to further intersect with another archive.
          nextSearchType = SearchType.DESCRIPTION;
          break;
        default:
          nextSearchType = typeOfLatestSearch;
          break;
      }
      setSearchType(nextSearchType);
    } else {
      setSearchType(SearchType.ALL);
    }
  }, [typeOfLatestSearch]);

  const dontShowAllSearch: boolean =
    !isAllSearchActive && Array.from(searchParams.entries()).length !== 0;

  const onSearchStart = (searchInput: string) => {
    if (searchInput === '') return;

    // Spaces are our delimiter for different search terms
    const newSearchRequest = searchInput.split(' ').map(encodeURIComponent).join(' ');

    const { isValid, searchPath } = addNewParamToSearchPath(
      searchType,
      newSearchRequest,
      searchParams
    );
    if (!isValid) {
      openAlert({
        alertType: AlertType.INFO,
        message: t('search.wrong-time-input-info'),
        duration: 7000,
      });
    } else {
      visit(searchPath);
      textFieldRef.current.value = '';
    }
  };

  const changeSearchType = (e: { target: { value: string } }) => {
    setSearchType(e.target.value);
  };

  return (
    <div className={isTopBarSearch ? 'search-bar-wrapper top-bar-search' : 'search-bar-wrapper'}>
      <TextField
        inputRef={textFieldRef}
        className='search-bar'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={() => {
                  onSearchStart(String(textFieldRef.current.value));
                }}
                className='searchbutton'
              >
                <div className='search-icon-container'>
                  <Search />
                  {!isTopBarSearch && (
                    <div className='searchbutton-label'>{t('search.start-search')}</div>
                  )}
                </div>
              </IconButton>
            </InputAdornment>
          ),

          startAdornment: useAdvancedSearch && (
            <InputAdornment position='start'>
              {isAllSearchActive ? (
                <span className='MuiInputBase-root'>{t('search.all')}</span>
              ) : (
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={searchType}
                  label='Age'
                  onChange={changeSearchType}
                >
                  {!dontShowAllSearch && (
                    <MenuItem value={SearchType.ALL}>
                      {t(getSearchTypeTranslation(SearchType.ALL))}
                    </MenuItem>
                  )}
                  <MenuItem value={SearchType.KEYWORD}>
                    {t(getSearchTypeTranslation(SearchType.KEYWORD))}
                  </MenuItem>
                  <MenuItem value={SearchType.TIME_RANGE}>
                    {t(getSearchTypeTranslation(SearchType.TIME_RANGE))}
                  </MenuItem>
                  <MenuItem value={SearchType.DESCRIPTION}>
                    {t(getSearchTypeTranslation(SearchType.DESCRIPTION))}
                  </MenuItem>
                  <MenuItem value={SearchType.PERSON}>
                    {t(getSearchTypeTranslation(SearchType.PERSON))}
                  </MenuItem>
                  <MenuItem value={SearchType.LOCATION}>
                    {t(getSearchTypeTranslation(SearchType.LOCATION))}
                  </MenuItem>
                  <MenuItem value={SearchType.COLLECTION}>
                    {t(getSearchTypeTranslation(SearchType.COLLECTION))}
                  </MenuItem>
                  <MenuItem value={SearchType.ARCHIVE}>
                    {t(getSearchTypeTranslation(SearchType.ARCHIVE))}
                  </MenuItem>
                </Select>
              )}
            </InputAdornment>
          ),
        }}
        onKeyUp={event => {
          if (event.key === 'Enter') {
            onSearchStart(String(textFieldRef.current.value));
          }
        }}
        placeholder={
          isTopBarSearch
            ? t('search.search-top-bar')
            : useAdvancedSearch
            ? t('search.search-for-type-advance')
            : t('search.search-for-type')
        }
        variant='outlined'
      />
    </div>
  );
};

export default SearchBar;
