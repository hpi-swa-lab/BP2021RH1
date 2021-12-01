import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import './SearchBar.scss';

const SearchBar = () => {
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
        placeholder='Stichworte suchen...'
        variant='outlined'
      />
    </div>
  );
};

export default SearchBar;
