import { useCallback, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useUpdateMeMutation } from '../../../../graphql/APIConnector';
import { useAuth } from '../../../../hooks/context-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import { FALLBACK_PATH } from '../../../routes';
import { UserView } from './UserView';

export const MyAccountView = () => {
  const { userId, username, email } = useAuth();
  const user: FlatUsersPermissionsUser | undefined = useMemo(
    () =>
      userId
        ? {
            id: userId,
            username: username ?? '',
            email: email ?? '',
          }
        : undefined,
    [userId, username, email]
  );

  const [updateMe] = useUpdateMeMutation({
    refetchQueries: ['me'],
  });

  const onSave = useCallback(
    (username: string, email: string) => {
      updateMe({
        variables: {
          username,
          email,
        },
      });
    },
    [updateMe]
  );

  if (!userId) {
    return <Redirect to={FALLBACK_PATH} />;
  }

  return <UserView user={user} onSave={onSave} />;
};
