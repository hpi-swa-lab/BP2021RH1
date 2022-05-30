import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { History } from 'history';
import './SearchBar.scss';
import { addNewParamToSearchPath, SearchType } from './SearchView';
import { AlertContext, AlertType } from '../../wrapper/AlertWrapper';

const SearchBar = ({
  searchParams,
  customSearch,
}: {
  searchParams: URLSearchParams;
  customSearch: boolean;
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
      setSearchType(typeOfLatestSearch);
    } else {
      setSearchType(SearchType.ALL);
    }
  }, [typeOfLatestSearch]);

  const dontShowAllSearch: boolean = !customSearch && !searchParams.values().next().done;

  const onSearchStart = (searchValue: string) => {
    if (searchValue === '') return;

    const searchRes = addNewParamToSearchPath(searchType, searchValue, searchParams);
    if (!searchRes.isValid) {
      openAlert({
        alertType: AlertType.INFO,
        message: t('search.wrong-time-input-info'),
        duration: 7000,
      });
    } else {
      history.push(searchRes.searchVal, {
        showBack: true,
      });
      textFieldRef.current.value = '';
    }
  };

  const changeSearchType = (e: { target: { value: string } }) => {
    setSearchType(e.target.value);
  };

  return (
    <div className='search-bar-wrapper'>
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
                <div>
                  <SearchIcon />
                  <div className='searchbutton-label'>{t('search.start-search')}</div>
                </div>
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position='start'>
              {customSearch ? (
                <span className='MuiInputBase-root'>{t('search.search-all')}</span>
              ) : (
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={searchType}
                  label='Age'
                  onChange={changeSearchType}
                >
                  {!dontShowAllSearch && (
                    <MenuItem value={SearchType.ALL}>{t('search.search-all')}</MenuItem>
                  )}
                  <MenuItem value={SearchType.KEYWORD}>{t('search.search-keyword')}</MenuItem>
                  <MenuItem value={SearchType.TIME_RANGE}>{t('search.search-decade')}</MenuItem>
                  <MenuItem value={SearchType.DESCRIPTION}>{t('search.descriptions')}</MenuItem>
                  <MenuItem value={SearchType.PERSON}>{t('search.persons')}</MenuItem>
                  <MenuItem value={SearchType.LOCATION}>{t('search.locations')}</MenuItem>
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
        placeholder={t('search.search-for-type')}
        variant='outlined'
      />
    </div>
  );
};

export default SearchBar;
