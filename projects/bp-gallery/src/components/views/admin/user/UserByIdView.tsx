import { useCallback } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useCanUpdateUser, useCanUseUserByIdView } from '../../../../hooks/can-do-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import ProtectedRoute from '../../../common/ProtectedRoute';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { UserView } from './UserView';
import { parseUserId } from './helper';

export const UserByIdView = ({ id }: { id: string }) => {
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

  const onSave = useCallback(
    (username: string, email: string) => {
      updateUser({
        variables: {
          id,
          username,
          email,
        },
      });
    },
    [updateUser, id]
  );

  const { canUseUserView, loading: canUseUserViewLoading } = useCanUseUserByIdView(id);
  const { canUpdateUser } = useCanUpdateUser(id);

  return (
    <ProtectedRoute canUse={canUseUserView} canUseLoading={canUseUserViewLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (user || isPublic) {
          return <UserView user={user} onSave={canUpdateUser ? onSave : undefined} />;
        }
      }}
    </ProtectedRoute>
  );
};
