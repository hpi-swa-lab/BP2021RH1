import { Button, Stack } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { useCanRunResetPasswordMutation } from '../../../../graphql/APIConnector';
import { useVisit } from '../../../../helpers/history';
import { useAuth } from '../../../../hooks/context-hooks';
import { PasswordInput } from '../../../common/PasswordInput';
import ProtectedRoute from '../../../common/ProtectedRoute';
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

  const { canRun: canResetPassword, loading: canResetPasswordLoading } =
    useCanRunResetPasswordMutation({
      variables: {
        token: token ?? '',
      },
    });

  if (!token) {
    return <Redirect to={FALLBACK_PATH} />;
  }

  return (
    <ProtectedRoute canUse={canResetPassword} canUseLoading={canResetPasswordLoading}>
      <CenteredContainer title={t('admin.resetPassword.title')}>
        <Stack gap={4}>
          <PasswordInput
            label={t('admin.resetPassword.password')}
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <PasswordInput
            label={t('admin.resetPassword.passwordConfirmation')}
            value={passwordConfirmation}
            onChange={event => setPasswordConfirmation(event.target.value)}
          />
          <Button variant='contained' className='w-fit self-center' onClick={doResetPassword}>
            {t('common.confirm')}
          </Button>
        </Stack>
      </CenteredContainer>
    </ProtectedRoute>
  );
};
