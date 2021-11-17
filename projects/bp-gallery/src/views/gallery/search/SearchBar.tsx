import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import './SearchBar.scss';

const SearchBar = () => {
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
        placeholder='Stichworte suchen...'
        variant='outlined'
      ></TextField>
    </div>
  );
};

export default SearchBar;
