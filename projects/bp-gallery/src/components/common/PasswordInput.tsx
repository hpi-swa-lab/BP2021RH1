import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { FocusEvent, useCallback, useRef, useState } from 'react';

export const PasswordInput = (props: TextFieldProps) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const toggleShow = useCallback(() => {
    setPasswordShown(passwordShown => !passwordShown);
  }, []);

  const input = useRef<HTMLDivElement>(null);

  const hidePassword = useCallback((event: FocusEvent<HTMLElement>) => {
    const newFocus = event.relatedTarget;
    if (input.current?.contains(newFocus)) {
      return;
    }
    setPasswordShown(false);
  }, []);

  return (
    <TextField
      ref={input}
      type={passwordShown ? 'text' : 'password'}
      variant='outlined'
      onBlur={hidePassword}
      InputProps={{
        endAdornment: (
          <IconButton onBlur={hidePassword} onClick={toggleShow}>
            {passwordShown ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
      }}
      {...props}
    />
  );
};
