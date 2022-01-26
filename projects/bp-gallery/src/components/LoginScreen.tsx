import React, { FormEvent, useState } from 'react';
import './LoginScreen.scss';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthWrapper';

const LoginScreen = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const { login, email, role } = useAuth();

  const submitForm = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMessage(undefined);
    if (username === '' || password === '') return;
    login(username, password).catch((err: string) => {
      setErrorMessage(err);
    });
  };

  return (
    <div className='login-screen'>
      {errorMessage && <div>{errorMessage}</div>}
      <p>
        <strong>Login-Info:</strong>
        <table>
          <tr>
            <td>E-Mail:</td>
            <td>{email}</td>
          </tr>
          <tr>
            <td>UserName:</td>
            <td>{username}</td>
          </tr>
          <tr>
            <td>Role:</td>
            <td>{role}</td>
          </tr>
        </table>
      </p>
      <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
      <div className='text-container'>{t('common.login')}</div>
      <form onSubmit={submitForm}>
        <TextField
          className='input-field'
          id='username'
          label={t('common.username')}
          variant='outlined'
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <TextField
          className='input-field'
          type='password'
          id='password'
          label={t('common.password')}
          variant='outlined'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Button className='login-button' type='submit'>
          {t('common.login')}
        </Button>
      </form>
    </div>
  );
};

export default LoginScreen;
