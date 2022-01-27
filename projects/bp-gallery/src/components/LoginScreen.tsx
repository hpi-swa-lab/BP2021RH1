import React, { FormEvent, useState } from 'react';
import './LoginScreen.scss';
import { Alert, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthWrapper';

const LoginScreen = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const { login } = useAuth();

  const submitForm = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMessage(undefined);
    if (username === '' || password === '') return;
    login(username, password).catch((err: string) => {
      if (err === 'Invalid identifier or password')
        setErrorMessage(t('common.invalid-credentials'));
      else setErrorMessage(err);
    });
  };

  return (
    <div className='login-screen'>
      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
      <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
      <div className='text-container'>{t('common.login')}</div>
      <form onSubmit={submitForm}>
        <TextField
          error={errorMessage !== undefined}
          className='input-field'
          id='username'
          label={t('common.username')}
          variant='filled'
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <TextField
          error={errorMessage !== undefined}
          className='input-field'
          type='password'
          id='password'
          label={t('common.password')}
          variant='filled'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Button variant='contained' type='submit'>
          {t('common.login')}
        </Button>
      </form>
    </div>
  );
};

export default LoginScreen;
