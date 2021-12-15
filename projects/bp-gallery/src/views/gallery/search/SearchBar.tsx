import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { History } from 'history';
import './SearchBar.scss';

const SearchBar = ({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange?: (snippet?: string) => void;
}) => {
  const { t } = useTranslation();
  const history: History = useHistory();
  const { search } = useLocation();

  const textFieldRef = useRef<any>();

  useEffect(() => {
    if (textFieldRef.current && value) {
      textFieldRef.current.value = value;
    }
  }, [value]);

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
            history.push(`/search/${String((event.target as any).value)}${String(search ?? '')}`, {
              showBack: true,
            });
          }
        }}
        placeholder={t('common.search-keywords')}
        variant='outlined'
      />
    </div>
  );
};

export default SearchBar;
