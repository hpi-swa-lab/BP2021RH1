import { Edit } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  useCanRunGetUsersPermissionsUsersQuery,
  useGetAllArchiveTagsQuery,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useVisit } from '../../../../helpers/history';
import { FlatArchiveTag } from '../../../../types/additionalFlatTypes';
import Loading from '../../../common/Loading';
import ProtectedRoute from '../../../common/ProtectedRoute';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import { CenteredContainer } from '../CenteredContainer';
import { AddArchiveButton } from './AddArchiveButton';

export const ArchivesView = () => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const { data, error, loading } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined = useSimplifiedQueryResponseData(data)?.archiveTags;

  const { canRun: canUse, loading: canUseLoading } = useCanRunGetUsersPermissionsUsersQuery();

  return (
    <ProtectedRoute canUse={canUse} canUseLoading={canUseLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (archives) {
          return (
            <CenteredContainer title={t('admin.archives.title')}>
              <AddArchiveButton onCreated={id => id !== null && visit(`/archives/${id}/edit`)} />
              <List>
                {archives.map(archive => (
                  <ListItemButton
                    key={archive.id}
                    onClick={() => visit(`/archives/${archive.id}/edit`)}
                  >
                    <ListItemText primary={archive.name} />
                    <ListItemIcon>
                      <Edit />
                    </ListItemIcon>
                  </ListItemButton>
                ))}
              </List>
            </CenteredContainer>
          );
        }
      }}
    </ProtectedRoute>
  );
};
