import { Edit } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllArchiveTagsQuery } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useVisit } from '../../../../helpers/history';
import { useCanUseArchivesView } from '../../../../hooks/can-do-hooks';
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

  const sortedArchives = useMemo(
    () => (archives ? archives.slice().sort((a, b) => a.name.localeCompare(b.name)) : undefined),
    [archives]
  );

  const { canUseArchivesView, loading: canUseArchivesViewLoading } = useCanUseArchivesView();

  return (
    <ProtectedRoute canUse={canUseArchivesView} canUseLoading={canUseArchivesViewLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (sortedArchives) {
          return (
            <CenteredContainer title={t('admin.archives.title')}>
              <AddArchiveButton onCreated={id => id !== null && visit(`/archives/${id}/edit`)} />
              <List>
                {sortedArchives.map(archive => (
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
