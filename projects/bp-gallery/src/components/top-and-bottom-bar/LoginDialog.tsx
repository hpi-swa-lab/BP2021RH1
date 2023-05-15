import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { FormEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/context-hooks';
import './LoginDialog.scss';

const LoginDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const { login } = useAuth();

  const close = useCallback(() => {
    setErrorMessage(undefined);
    setUsername('');
    setPassword('');
    onClose();
  }, [setUsername, setPassword, setErrorMessage, onClose]);

  const submitForm = (evt: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    evt.preventDefault();
    setErrorMessage(undefined);
    if (username === '' || password === '') return;
    login(username, password)
      .then(close)
      .catch((err: string) => {
        if (err === 'Invalid identifier or password')
          setErrorMessage(t('login.invalid-credentials'));
        else setErrorMessage(err);
      });
  };

  return (
    <Dialog open={open} fullWidth={false} onClose={close} className='login-screen'>
      <form onSubmit={submitForm}>
        <DialogTitle>{t('login.title')}</DialogTitle>
        <DialogContent>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          <TextField
            error={errorMessage !== undefined}
            className='input-field'
            id='username'
            label={t('login.username')}
            variant='outlined'
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <div className='input-with-icon'>
            <TextField
              error={errorMessage !== undefined}
              className='input-field'
              type={passwordShown ? 'text' : 'password'}
              id='password'
              label={t('login.password')}
              variant='outlined'
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
            <IconButton id='toggleButton' onClick={togglePassword}>
              {passwordShown ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color='primary'>
            {t('common.close')}
          </Button>
          <Button type='submit' autoFocus>
            {t('login.title')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
