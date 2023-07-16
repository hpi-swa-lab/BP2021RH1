import { ArrowForwardIos } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisit } from '../../../../helpers/history';
import {
  useCanChangePasswordForUser,
  useCanUsePermissionsView,
} from '../../../../hooks/can-do-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import { CenteredContainer } from '../CenteredContainer';
import { RemoveUserButton } from './RemoveUserButton';
import { PUBLIC_USER_ID } from './helper';

export const UserView = ({
  user,
  onSave,
}: {
  user: FlatUsersPermissionsUser | undefined;
  onSave?: (username: string, email: string) => void;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const isPublic = !user;
  const id = user?.id ?? PUBLIC_USER_ID;

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const save = useCallback(() => {
    onSave?.(username, email);
  }, [onSave, username, email]);

  const savePending = user && (username !== user.username || email !== user.email);

  const { canUsePermissionsView } = useCanUsePermissionsView(id);
  const { canChangePassword } = useCanChangePasswordForUser(id);

  return (
    <CenteredContainer
      title={
        isPublic ? t('admin.user.publicTitle') : t('admin.user.title', { userName: user.username })
      }
    >
      <Stack gap={4}>
        {user && (
          <TextField
            label={t('admin.user.name')}
            value={username}
            onChange={event => setUsername(event.target.value)}
            disabled={!onSave}
          />
        )}
        {user && (
          <TextField
            label={t('admin.user.email')}
            type='email'
            value={email}
            onChange={event => setEmail(event.target.value)}
            disabled={!onSave}
          />
        )}
        {savePending && (
          <Button variant='contained' className='w-fit self-center' onClick={save}>
            {t('curator.save')}
          </Button>
        )}
        {canChangePassword && (
          <Button
            variant='contained'
            className='w-fit self-center'
            onClick={() => visit('/change-password')}
            endIcon={<ArrowForwardIos />}
          >
            {t('admin.changePassword.title')}
          </Button>
        )}
        {canUsePermissionsView && (
          <Button
            variant='contained'
            className='w-fit self-center'
            onClick={() => visit(`/admin/user/${id}/permissions`)}
            endIcon={<ArrowForwardIos />}
          >
            {t('admin.user.permissions')}
          </Button>
        )}
        <RemoveUserButton user={user} />
      </Stack>
    </CenteredContainer>
  );
};
