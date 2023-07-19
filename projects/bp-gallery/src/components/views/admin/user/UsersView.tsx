import { ChevronRight, Edit } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunGetUserQuery,
  useCanRunUpdateUserMutation,
  useGetUsersQuery,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useVisit } from '../../../../helpers/history';
import { useCanUseUsersView } from '../../../../hooks/can-do-hooks';
import { useAuth } from '../../../../hooks/context-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import ProtectedRoute from '../../../common/ProtectedRoute';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { CenteredContainer } from '../CenteredContainer';
import { AddUserButton } from './AddUserButton';
import { PUBLIC_USER_ID } from './helper';

export const UsersView = () => {
  const { t } = useTranslation();
  const { visit } = useVisit();
  const { userId } = useAuth();

  const { data, error, loading } = useGetUsersQuery();
  const users: FlatUsersPermissionsUser[] | undefined =
    useSimplifiedQueryResponseData(data)?.usersPermissionsUsers;

  const { canRun: canGetUser } = useCanRunGetUserQuery();
  const { canRun: canUpdateUser } = useCanRunUpdateUserMutation();

  const sortedUsers = useMemo(
    () => (users ? users.slice().sort((a, b) => a.username.localeCompare(b.username)) : undefined),
    [users]
  );

  const { canUseUsersView, loading: canUseUsersViewLoading } = useCanUseUsersView();

  return (
    <ProtectedRoute canUse={canUseUsersView} canUseLoading={canUseUsersViewLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (sortedUsers) {
          return (
            <CenteredContainer title={t('admin.users.title')}>
              <AddUserButton />
              <List>
                {[
                  { id: PUBLIC_USER_ID, username: t('admin.users.publicUsername') },
                  ...sortedUsers,
                ].map(user => {
                  const isMe = user.id === userId;
                  const visible = canGetUser || isMe;
                  const editable = canUpdateUser || isMe;
                  const path = isMe ? '/my-account' : `/admin/user/${user.id}`;
                  return (
                    <ListItemButton
                      key={user.id}
                      onClick={visible ? () => visit(path) : undefined}
                      disabled={!visible}
                    >
                      <ListItemText primary={user.username} />
                      {visible && (
                        <ListItemIcon>{editable ? <Edit /> : <ChevronRight />}</ListItemIcon>
                      )}
                    </ListItemButton>
                  );
                })}
              </List>
            </CenteredContainer>
          );
        }
      }}
    </ProtectedRoute>
  );
};
