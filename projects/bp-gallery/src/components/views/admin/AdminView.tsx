import { ChevronRight } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useVisit } from '../../../helpers/history';
import { useCanUseAdminView } from '../../../hooks/can-do-hooks';
import ProtectedRoute from '../../common/ProtectedRoute';
import { CenteredContainer } from './CenteredContainer';

export const AdminView = () => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const { canUseAdminView, loading: canUseAdminViewLoading } = useCanUseAdminView();

  return (
    <ProtectedRoute canUse={canUseAdminView} canUseLoading={canUseAdminViewLoading}>
      <CenteredContainer title={t('admin.title')}>
        <List>
          {[
            {
              title: t('admin.users.title'),
              path: '/admin/users',
            },
            {
              title: t('admin.archives.title'),
              path: '/admin/archives',
            },
          ].map(({ title, path }) => (
            <ListItemButton key={path} onClick={() => visit(path)}>
              <ListItemText primary={<h3>{title}</h3>} />
              <ListItemIcon>
                <ChevronRight />
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </CenteredContainer>
    </ProtectedRoute>
  );
};
