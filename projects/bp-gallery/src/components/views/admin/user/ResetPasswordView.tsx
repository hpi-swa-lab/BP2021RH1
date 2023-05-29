import { Stack, TextField } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { useVisit } from '../../../../helpers/history';
import { useAuth } from '../../../../hooks/context-hooks';
import PrimaryButton from '../../../common/PrimaryButton';
import { FALLBACK_PATH } from '../../../routes';
import { CenteredContainer } from '../CenteredContainer';

export const ResetPasswordView = () => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const token = useMemo(() => new URLSearchParams(location.search).get('token'), []);

  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const doResetPassword = useCallback(async () => {
    if (!token) {
      return;
    }
    await resetPassword(token, password, passwordConfirmation);
    visit(FALLBACK_PATH);
  }, [token, resetPassword, password, passwordConfirmation, visit]);

  if (!token) {
    return <Redirect to={FALLBACK_PATH} />;
  }

  return (
    <CenteredContainer title={t('admin.resetPassword.title')}>
      <Stack gap={4}>
        <TextField
          label={t('admin.resetPassword.password')}
          type='password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <TextField
          label={t('admin.resetPassword.passwordConfirmation')}
          type='password'
          value={passwordConfirmation}
          onChange={event => setPasswordConfirmation(event.target.value)}
        />
        <PrimaryButton onClick={doResetPassword}>{t('common.confirm')}</PrimaryButton>
      </Stack>
    </CenteredContainer>
  );
};
