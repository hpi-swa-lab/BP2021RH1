import { Button, Stack, TextField } from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForgotPasswordMutation } from '../../../../graphql/APIConnector';
import { useCanUseForgotPasswordView } from '../../../../hooks/can-do-hooks';
import ProtectedRoute from '../../../common/ProtectedRoute';
import { AlertContext, AlertType } from '../../../provider/AlertProvider';
import { CenteredContainer } from '../CenteredContainer';

export const ForgotPasswordView = () => {
  const { t } = useTranslation();
  const openAlert = useContext(AlertContext);

  const [forgotPassword] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');

  const doForgotPassword = useCallback(async () => {
    const result = await forgotPassword({
      variables: {
        email,
      },
    });
    if (result.data?.forgotPassword?.ok) {
      openAlert({
        alertType: AlertType.SUCCESS,
        message: t('admin.forgotPassword.success'),
      });
    }
  }, [forgotPassword, email, openAlert, t]);

  const { canUseForgotPasswordView, loading: canUseForgotPasswordViewLoading } =
    useCanUseForgotPasswordView();

  return (
    <ProtectedRoute
      canUse={canUseForgotPasswordView}
      canUseLoading={canUseForgotPasswordViewLoading}
    >
      <CenteredContainer title={t('admin.forgotPassword.title')}>
        <Stack gap={4}>
          <p>{t('admin.forgotPassword.explanation')}</p>
          <TextField
            label={t('admin.forgotPassword.email')}
            type='email'
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <Button variant='contained' className='w-fit self-center' onClick={doForgotPassword}>
            {t('common.confirm')}
          </Button>
        </Stack>
      </CenteredContainer>
    </ProtectedRoute>
  );
};
