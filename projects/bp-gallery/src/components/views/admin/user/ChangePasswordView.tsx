import { Stack, TextField } from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangePasswordMutation } from '../../../../graphql/APIConnector';
import { useCanChangePassword } from '../../../../hooks/can-do-hooks';
import PrimaryButton from '../../../common/PrimaryButton';
import ProtectedRoute from '../../../common/ProtectedRoute';
import { AlertContext, AlertType } from '../../../provider/AlertProvider';
import { CenteredContainer } from '../CenteredContainer';

export const ChangePasswordView = () => {
  const { t } = useTranslation();
  const openAlert = useContext(AlertContext);

  const [changePassword] = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const doChangePassword = useCallback(async () => {
    const result = await changePassword({
      variables: {
        currentPassword,
        password,
        passwordConfirmation,
      },
    });
    if (result.data?.changePassword?.jwt) {
      openAlert({
        alertType: AlertType.SUCCESS,
        message: t('admin.changePassword.success'),
      });
    }
  }, [changePassword, currentPassword, password, passwordConfirmation, openAlert, t]);

  const { canChangePassword, loading: canChangePasswordLoading } = useCanChangePassword();

  return (
    <ProtectedRoute canUse={canChangePassword} canUseLoading={canChangePasswordLoading}>
      <CenteredContainer title={t('admin.changePassword.title')}>
        <Stack gap={4}>
          <TextField
            label={t('admin.changePassword.currentPassword')}
            type='password'
            value={currentPassword}
            onChange={event => setCurrentPassword(event.target.value)}
          />
          <TextField
            label={t('admin.changePassword.password')}
            type='password'
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <TextField
            label={t('admin.changePassword.passwordConfirmation')}
            type='password'
            value={passwordConfirmation}
            onChange={event => setPasswordConfirmation(event.target.value)}
          />
          <PrimaryButton onClick={doChangePassword}>{t('common.confirm')}</PrimaryButton>
        </Stack>
      </CenteredContainer>
    </ProtectedRoute>
  );
};