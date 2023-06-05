import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { useCallback, useState } from 'react';

export const PasswordInput = (props: TextFieldProps) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const toggleShow = useCallback(() => {
    setPasswordShown(passwordShown => !passwordShown);
  }, []);

  return (
    <TextField
      type={passwordShown ? 'text' : 'password'}
      variant='outlined'
      InputProps={{
        endAdornment: (
          <IconButton onClick={toggleShow}>
            {passwordShown ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
      }}
      {...props}
    />
  );
};
