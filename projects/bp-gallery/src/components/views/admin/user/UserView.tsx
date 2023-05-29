import { Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetUsersPermissionsUserQuery,
  useUpdateUsersPermissionsUserMutation,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useVisit } from '../../../../helpers/history';
import { useAuth } from '../../../../hooks/context-hooks';
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

  const { userId: loggedInUserId } = useAuth();

  const { parsedUserId, isPublic } = parseUserId(id);

  const { data, error, loading } = useGetUsersPermissionsUserQuery({
    variables: {
      id: parsedUserId ?? '-1',
    },
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(data)?.usersPermissionsUser;

  const [updateUsersPermissionsUser] = useUpdateUsersPermissionsUserMutation({
    refetchQueries: ['getUsersPermissionsUser'],
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
    updateUsersPermissionsUser({
      variables: {
        id,
        username,
        email,
      },
    });
  }, [updateUsersPermissionsUser, id, username, email]);

  const savePending = user && (username !== user.username || email !== user.email);
  return (
    <ProtectedRoute canUse={true} canUseLoading={false}>
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
                  />
                )}
                {user && (
                  <TextField
                    label={t('admin.user.email')}
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                  />
                )}
                {savePending && <PrimaryButton onClick={onSave}>{t('curator.save')}</PrimaryButton>}
                {user && user.id === loggedInUserId && (
                  <PrimaryButton onClick={() => visit('/change-password')} withRightArrow>
                    {t('admin.changePassword.title')}
                  </PrimaryButton>
                )}
                <PrimaryButton
                  onClick={() => visit(`/admin/user/${id}/permissions`)}
                  withRightArrow
                >
                  {t('admin.user.permissions')}
                </PrimaryButton>
                <RemoveUserButton id={parsedUserId ?? undefined} />
              </Stack>
            </CenteredContainer>
          );
        }
      }}
    </ProtectedRoute>
  );
};
