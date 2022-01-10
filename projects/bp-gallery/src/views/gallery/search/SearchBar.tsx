import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { History } from 'history';
import './SearchBar.scss';
import { asSearchPath, SearchParam, SearchType } from './SearchView';

const SearchBar = ({
  searchParams,
  value,
  onValueChange,
}: {
  searchParams?: SearchParam[];
  value?: string;
  onValueChange?: (snippet?: string) => void;
}) => {
  const { t } = useTranslation();
  const history: History = useHistory();

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
            history.push(
              asSearchPath([
                ...(searchParams ?? []),
                { value: String((event.target as any).value), type: SearchType.DEFAULT },
              ]),
              {
                showBack: true,
              }
            );
            textFieldRef.current.value = '';
          }
        }}
        placeholder={t('common.search-keywords')}
        variant='outlined'
      />
    </div>
  );
};

export default SearchBar;
