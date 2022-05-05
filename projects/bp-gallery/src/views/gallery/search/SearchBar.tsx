import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { History } from 'history';
import './SearchBar.scss';
import { addNewParamToSearchPath, SearchType } from './SearchView';

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
          startAdornment: (
            <InputAdornment position='start'>
              <Search />
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
      />
    </div>
  );
};

export default SearchBar;
