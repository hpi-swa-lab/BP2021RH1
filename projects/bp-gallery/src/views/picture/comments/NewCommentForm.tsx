import React from 'react';
import { TextField } from '@mui/material';

const NewCommentForm = () => {
  return (
    <form>
      <TextField id='outlined-basic' label='name' variant='outlined' />
      <br />
      <TextField id='outlined-basic' label='text' variant='outlined' />
      <br />
      <input type='submit' value='Submit' />
    </form>
  );
};

export default NewCommentForm;
