import { Edit } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetUsersPermissionsUsersQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useVisit } from '../../../../helpers/history';
import { useCanUseUsersView } from '../../../../hooks/can-do-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import ProtectedRoute from '../../../common/ProtectedRoute';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { CenteredContainer } from '../CenteredContainer';
import { AddUserButton } from './AddUserButton';

export const UsersView = () => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const { data, error, loading } = useGetUsersPermissionsUsersQuery();
  const users: FlatUsersPermissionsUser[] | undefined =
    useSimplifiedQueryResponseData(data)?.usersPermissionsUsers;

  const { canUseUsersView, loading: canUseUsersViewLoading } = useCanUseUsersView();

  return (
    <ProtectedRoute canUse={canUseUsersView} canUseLoading={canUseUsersViewLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (users) {
          return (
            <CenteredContainer title={t('admin.users.title')}>
              <AddUserButton />
              <List>
                {[{ id: 'public', username: t('admin.users.publicUsername') }, ...users].map(
                  user => (
                    <ListItemButton key={user.id} onClick={() => visit(`/admin/user/${user.id}`)}>
                      <ListItemText primary={user.username} />
                      <ListItemIcon>
                        <Edit />
                      </ListItemIcon>
                    </ListItemButton>
                  )
                )}
              </List>
            </CenteredContainer>
          );
        }
      }}
    </ProtectedRoute>
  );
};
