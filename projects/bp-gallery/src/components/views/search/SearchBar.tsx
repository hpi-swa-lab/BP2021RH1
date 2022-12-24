import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { History } from 'history';
import './SearchBar.scss';
import { AlertContext, AlertType } from '../../provider/AlertProvider';
import { getSearchTypeTranslation } from './helpers/search-translation';
import useAdvancedSearch from './helpers/useAdvancedSearch';
import { addNewParamToSearchPath } from './helpers/addNewParamToSearchPath';
import { SearchType } from './helpers/search-filters';

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
  const history: History = useHistory();
  const openAlert = useContext(AlertContext);
  const textFieldRef = useRef<any>();
  const [searchType, setSearchType] = useState<string>(SearchType.ALL);

  const typeOfLatestSearch = useMemo(() => {
    const searchParamsIterator = searchParams.entries();
    let nextParam = searchParamsIterator.next();
    let latestType;
    while (!nextParam.done) {
      latestType = nextParam.value[0];
      nextParam = searchParamsIterator.next();
    }
    return latestType;
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

  const dontShowAllSearch: boolean = !isAllSearchActive && !searchParams.values().next().done;

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
      history.push(searchPath, {
        showBack: true,
      });
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
                  <SearchIcon />
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
