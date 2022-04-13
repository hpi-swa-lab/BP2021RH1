import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IconButton, InputAdornment, TextField } from '@mui/material';
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

  const onSearchStart = (searchValue: string) => {
    if (searchValue === '') return;
    history.push(addNewParamToSearchPath(SearchType.DEFAULT, searchValue, searchParams), {
      showBack: true,
    });
    textFieldRef.current.value = '';
    if (onValueChange) onValueChange('');
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
    </div>
  );
};

export default SearchBar;
