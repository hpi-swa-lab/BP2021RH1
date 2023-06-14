import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateArchiveTagMutation } from '../../../graphql/APIConnector';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { HideStats } from '../../provider/ShowStatsProvider';
import './UploadsView.scss';

const UploadsView = () => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const dialog = useDialog();

  const [createArchiveTagMutation] = useCreateArchiveTagMutation();

  const { moveToCollection, createSequence, bulkEdit } = useBulkOperations();

  const uploadAreaProps = useMemo(() => {
    return role >= AuthRole.CURATOR
      ? {
          // No additional information added to the pictures in this view here.
          preprocessPictures: (pictures: FlatPicture[]) => pictures,
          folderName: t('curator.uploads'),
        }
      : undefined;
  }, [role, t]);

  const createArchive = useCallback(async () => {
    const archiveName = await dialog({
      title: t('curator.createArchive'),
      preset: DialogPreset.INPUT_FIELD,
    });
    if (archiveName?.length) {
      createArchiveTagMutation({
        variables: {
          name: archiveName,
        },
      });
    }
  }, [createArchiveTagMutation, dialog, t]);

  if (role < AuthRole.CURATOR) return null;
  return (
    <div className='uploads-overview'>
      <Button onClick={createArchive}>
        <Add />
        {t('curator.createArchive')}
      </Button>
      <HideStats>
        <PictureScrollGrid
          queryParams={{ collections: { id: { null: true } } }}
          hashbase={'uploads'}
          uploadAreaProps={uploadAreaProps}
          bulkOperations={[moveToCollection, createSequence, bulkEdit]}
        />
      </HideStats>
    </div>
  );
};
export default UploadsView;
