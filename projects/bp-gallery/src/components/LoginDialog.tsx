import React, { FormEvent, useState } from 'react';
import './LoginDialog.scss';
import { Alert, Button, Dialog, Icon, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthWrapper';

const LoginDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
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
    <Dialog open={open} fullWidth={true} onClose={onClose}>
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
        <Button onClick={onClose} className='close-button'>
          <Icon fontSize='large'>close</Icon>
        </Button>
      </div>
    </Dialog>
  );
};

export default LoginDialog;
