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
}: {
  searchParams?: URLSearchParams;
  onValueChange?: (snippet?: string) => void;
}) => {
  const { t } = useTranslation();
  const history: History = useHistory();
  const textFieldRef = useRef<any>();
  const [searchType, setSearchType] = useState(SearchType.ALL);

  const onSearchStart = (searchValue: string) => {
    if (searchValue === '') return;
    history.push(addNewParamToSearchPath(searchType, searchValue, searchParams), {
      showBack: true,
    });
    textFieldRef.current.value = '';
    if (onValueChange) onValueChange('');
  };

  const changeSearchType = (e: { target: { value: string } }) => {
    setSearchType(e.target.value as SearchType);
    // e.target.value = "baum"
    console.log(searchType);
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
                onClick={event => {
                  onSearchStart(String(textFieldRef.current.value));
                }}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyUp={event => {
          if (event.key === 'Enter') {
            onSearchStart(String(textFieldRef.current.value));
          }
        }}
        placeholder={t('common.search-keywords')}
        variant='outlined'
      ></TextField>
      <InputLabel id='demo-simple-select-label'>Age</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={searchType}
        label='Age'
        onChange={changeSearchType}
      >
        <MenuItem value={SearchType.DECADE}>{SearchType.DECADE}</MenuItem>
        <MenuItem value={SearchType.KEYWORD}>{SearchType.KEYWORD}</MenuItem>
        <MenuItem value={SearchType.ALL}>{SearchType.ALL}</MenuItem>
      </Select>
    </div>
  );
};

export default SearchBar;
