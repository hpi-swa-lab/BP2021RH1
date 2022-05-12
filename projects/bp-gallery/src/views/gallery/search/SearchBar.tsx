import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { History } from 'history';
import './SearchBar.scss';
import { addNewParamToSearchPath, SearchType } from './SearchView';

const SearchBar = ({
  searchParams,
  onInvalidEntry,
}: {
  searchParams?: URLSearchParams;
  onInvalidEntry: (value: boolean) => void;
}) => {
  const { t } = useTranslation();
  const history: History = useHistory();
  const textFieldRef = useRef<any>();
  const [searchType, setSearchType] = useState(SearchType.ALL);

  const onSearchStart = (searchValue: string) => {
    if (searchValue === '') return;

    const searchRes = addNewParamToSearchPath(searchType, searchValue, searchParams);
    onInvalidEntry(searchRes.isValid);

    history.push(searchRes.searchVal, {
      showBack: true,
    });
    textFieldRef.current.value = '';
  };

  const changeSearchType = (e: { target: { value: string } }) => {
    setSearchType(e.target.value);
  };

  return (
    <div className='search-bar'>
      <TextField
        inputRef={textFieldRef}
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
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={searchType}
                label='Age'
                onChange={changeSearchType}
              >
                <MenuItem value={SearchType.ALL}>{t('search.search-all')}</MenuItem>
                <MenuItem value={SearchType.DECADE}>{t('search.search-decade')}</MenuItem>
                <MenuItem value={SearchType.KEYWORD}>{t('search.search-keyword')}</MenuItem>
                <MenuItem value={SearchType.DESCRIPTION}>{t('search.descriptions')}</MenuItem>
                <MenuItem value={SearchType.PERSON}>{t('search.persons')}</MenuItem>
                <MenuItem value={SearchType.LOCATION}>{t('search.locations')}</MenuItem>
              </Select>
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
