import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddUserMutation } from '../../../../graphql/APIConnector';
import { useVisit } from '../../../../helpers/history';
import { useCanAddUser } from '../../../../hooks/can-do-hooks';
import { DialogPreset, useDialog } from '../../../provider/DialogProvider';

export const AddUserButton = () => {
  const { t } = useTranslation();
  const dialog = useDialog();
  const { visit } = useVisit();

  const [addUser] = useAddUserMutation();

  const addUserDialog = useCallback(async () => {
    const userParams = await dialog({
      title: t('admin.users.add'),
      preset: DialogPreset.ADD_USER,
      content: t('admin.users.add-content'),
    });
    if (!userParams) {
      return;
    }
    const { username, email } = userParams;
    const createdUser = await addUser({
      variables: {
        username,
        email,
      },
    });
    const id = createdUser.data?.addUser;
    if (!id) {
      return;
    }
    visit(`/admin/user/${id}`);
  }, [dialog, t, addUser, visit]);

  const { canAddUser } = useCanAddUser();

  if (!canAddUser) {
    return null;
  }

  return (
    <Button onClick={addUserDialog} startIcon={<Add />}>
      {t('admin.users.add')}
    </Button>
  );
};
