import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { History } from 'history';
import './SearchBar.scss';

const SearchBar = () => {
  const { t } = useTranslation();
  const history: History = useHistory();

  return (
    <div className='search-bar'>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          ),
        }}
        onKeyUp={event => {
          if (event.key === 'Enter') {
            history.push(`/search/${String((event.target as any).value)}`, {
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
