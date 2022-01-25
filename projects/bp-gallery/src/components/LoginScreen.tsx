import React, { useState } from 'react';
import './LoginScreen.scss';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../graphql/APIConnector';
import { httpLink } from '../App';
import { ApolloError, useApolloClient } from '@apollo/client';

export const logout = () => {
  sessionStorage.removeItem('jwt');
  const apolloClient = useApolloClient();
  apolloClient.setLink(httpLink(null));
};

const LoginScreen = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [loginMutation] = useLoginMutation({
    onError: (error: ApolloError) => {
      if (error.graphQLErrors.length && error.graphQLErrors[0].message === 'Bad Request')
        setErrorMessage(t('common.invalid-inputs'));
    },
    onCompleted: () => {
      setErrorMessage(undefined);
    },
  });

  const apolloClient = useApolloClient();

  const login = async () => {
    if (username === '' || password === '') return;
    const queryResult = await loginMutation({ variables: { username, password } });
    const token = queryResult.data?.login.jwt;
    if (token) {
      sessionStorage.setItem('jwt', token);
      apolloClient.setLink(httpLink(token));
    }
    setUsername('');
    setPassword('');
  };

  return (
    <div className='login-screen'>
      {errorMessage && <div>{errorMessage}</div>}
      <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
      <div className='text-container'>{t('common.login')}</div>
      <TextField
        className='input-field'
        id='username'
        label={t('common.username')}
        variant='outlined'
        value={username}
        onChange={event => setUsername(event.target.value)}
        onKeyUp={event => {
          if (event.key === 'Enter') login();
        }}
      />
      <TextField
        className='input-field'
        type='password'
        id='password'
        label={t('common.password')}
        variant='outlined'
        value={password}
        onChange={event => setPassword(event.target.value)}
        onKeyUp={event => {
          if (event.key === 'Enter') login();
        }}
      />
      <Button className='login-button' onClick={login}>
        {t('common.login')}
      </Button>
    </div>
  );
};

export default LoginScreen;
