import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { History } from 'history';
import './SearchBar.scss';
import { addNewParamToSearchPath, SearchType } from './SearchView';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({
  searchParams,
  onValueChange,
  onInvalidEntry,
}: {
  searchParams?: URLSearchParams;
  onValueChange?: (snippet?: string) => void;
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
    if (onValueChange) onValueChange('');
  };

  const changeSearchType = (e: { target: { value: string } }) => {
    setSearchType(e.target.value as SearchType);
  };

  const displayText = (thisSearchType: SearchType) => {
    switch (thisSearchType) {
      case SearchType.DECADE:
        return t('search.search-decade');
      case SearchType.KEYWORD:
        return t('search.search-keyword');
      case SearchType.DESCRIPTION:
        return t('search.search-description');
      default:
        return t('search.search-all');
    }
  };

  return (
    <div className='search-bar'>
      <TextField
        inputRef={textFieldRef}
        onChange={event => {
          if (onValueChange) {
            onValueChange(String(event.target.value));
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={() => {
                  onSearchStart(String(textFieldRef.current.value));
                }}
                className='searchbutton'
              >
                <SearchIcon />
                <div className='searchbutton-label'>{t('search.start-search')}</div>
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position='start'>
              <InputLabel id='demo-simple-select-label'>
                {/* {t('search.choose-searchtypes')} */}
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={searchType}
                label='Age'
                onChange={changeSearchType}
              >
                <MenuItem value={SearchType.ALL}>{displayText(SearchType.ALL)}</MenuItem>
                <MenuItem value={SearchType.DECADE}>{displayText(SearchType.DECADE)}</MenuItem>
                <MenuItem value={SearchType.KEYWORD}>{displayText(SearchType.KEYWORD)}</MenuItem>
                <MenuItem value={SearchType.DESCRIPTION}>
                  {displayText(SearchType.DESCRIPTION)}
                </MenuItem>
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
