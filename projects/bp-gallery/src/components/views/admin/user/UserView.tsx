import { Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetUserQuery, useUpdateUserMutation } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useVisit } from '../../../../helpers/history';
import {
  useCanChangePasswordForUser,
  useCanUpdateUser,
  useCanUsePermissionsView,
  useCanUseUserView,
} from '../../../../hooks/can-do-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import PrimaryButton from '../../../common/PrimaryButton';
import ProtectedRoute from '../../../common/ProtectedRoute';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { CenteredContainer } from '../CenteredContainer';
import { RemoveUserButton } from './RemoveUserButton';
import { parseUserId } from './helper';

export const UserView = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const { parsedUserId, isPublic } = parseUserId(id);

  const { data, error, loading } = useGetUserQuery({
    variables: {
      id: parsedUserId ?? '-1',
    },
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(data)?.usersPermissionsUser;

  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['getUser'],
  });

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const onSave = useCallback(() => {
    updateUser({
      variables: {
        id,
        username,
        email,
      },
    });
  }, [updateUser, id, username, email]);

  const savePending = user && (username !== user.username || email !== user.email);

  const { canUseUserView, loading: canUseUserViewLoading } = useCanUseUserView(id);
  const { canUpdateUser } = useCanUpdateUser(id);
  const { canUsePermissionsView } = useCanUsePermissionsView(id);
  const { canChangePassword } = useCanChangePasswordForUser(id);

  return (
    <ProtectedRoute canUse={canUseUserView} canUseLoading={canUseUserViewLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (user || isPublic) {
          return (
            <CenteredContainer
              title={
                isPublic
                  ? t('admin.user.publicTitle')
                  : t('admin.user.title', { userName: user?.username })
              }
            >
              <Stack gap={4}>
                {user && (
                  <TextField
                    label={t('admin.user.name')}
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    disabled={!canUpdateUser}
                  />
                )}
                {user && (
                  <TextField
                    label={t('admin.user.email')}
                    type='email'
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    disabled={!canUpdateUser}
                  />
                )}
                {savePending && <PrimaryButton onClick={onSave}>{t('curator.save')}</PrimaryButton>}
                {canChangePassword && (
                  <PrimaryButton onClick={() => visit('/change-password')} withRightArrow>
                    {t('admin.changePassword.title')}
                  </PrimaryButton>
                )}
                {canUsePermissionsView && (
                  <PrimaryButton
                    onClick={() => visit(`/admin/user/${id}/permissions`)}
                    withRightArrow
                  >
                    {t('admin.user.permissions')}
                  </PrimaryButton>
                )}
                <RemoveUserButton id={parsedUserId ?? undefined} />
              </Stack>
            </CenteredContainer>
          );
        }
      }}
    </ProtectedRoute>
  );
};
