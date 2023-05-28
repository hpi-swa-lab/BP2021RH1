import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddArchiveTagMutation } from '../../../../graphql/APIConnector';
import { useCanAddArchive } from '../../../../hooks/can-do-hooks';
import { DialogPreset, useDialog } from '../../../provider/DialogProvider';

export const AddArchiveButton = ({ onCreated }: { onCreated?: (id: string | null) => void }) => {
  const { t } = useTranslation();
  const dialog = useDialog();

  const [addArchiveTagMutation] = useAddArchiveTagMutation();

  const createArchive = useCallback(async () => {
    const archiveName = await dialog({
      title: t('admin.archives.add'),
      content: t('admin.archives.add-content'),
      preset: DialogPreset.INPUT_FIELD,
    });
    if (archiveName?.length) {
      const created = await addArchiveTagMutation({
        variables: {
          name: archiveName,
        },
      });
      onCreated?.(created.data?.addArchiveTag?.toString() ?? null);
    }
  }, [addArchiveTagMutation, dialog, t, onCreated]);

  const { canAddArchive } = useCanAddArchive();

  if (!canAddArchive) {
    return null;
  }
  return (
    <Button onClick={createArchive} startIcon={<Add />}>
      {t('admin.archives.add')}
    </Button>
  );
};
