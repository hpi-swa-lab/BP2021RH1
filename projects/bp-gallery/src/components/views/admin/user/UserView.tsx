import { Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetUsersPermissionsUserQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useVisit } from '../../../../helpers/history';
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

  const { data, error, loading } = useGetUsersPermissionsUserQuery({
    variables: {
      id: parsedUserId ?? '-1',
    },
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(data)?.usersPermissionsUser;

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
                {user && <TextField label={t('admin.user.name')} value={user.username}></TextField>}
                {user && <TextField label={t('admin.user.email')} value={user.email}></TextField>}
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
