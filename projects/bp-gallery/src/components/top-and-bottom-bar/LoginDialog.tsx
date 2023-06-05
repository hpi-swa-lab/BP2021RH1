import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { FormEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisit } from '../../helpers/history';
import { useCanUseForgotPasswordView } from '../../hooks/can-do-hooks';
import { useAuth } from '../../hooks/context-hooks';
import { translateErrorMessage } from '../../i18n';
import { PasswordInput } from '../common/PasswordInput';
import './LoginDialog.scss';

const LoginDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

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
        setErrorMessage(translateErrorMessage(err, t, 'login'));
      });
  };

  const { canUseForgotPasswordView } = useCanUseForgotPasswordView();

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
          <PasswordInput
            error={errorMessage !== undefined}
            className='input-field'
            id='password'
            label={t('login.password')}
            variant='outlined'
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          {canUseForgotPasswordView && (
            <Button
              onClick={() => {
                onClose();
                visit('/forgot-password');
              }}
            >
              {t('admin.forgotPassword.question')}
            </Button>
          )}
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
