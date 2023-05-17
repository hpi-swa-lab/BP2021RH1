import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { useCreateArchiveTagMutation } from '../../../graphql/APIConnector';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { useCanUseUploadsView } from '../../../hooks/can-do-hooks';
import { useAuth } from '../../../hooks/context-hooks';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { AuthRole } from '../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { HideStats } from '../../provider/ShowStatsProvider';
import { FALLBACK_PATH } from '../../routes';
import './UploadsView.scss';

const UploadsView = () => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const dialog = useDialog();

  const [createArchiveTagMutation] = useCreateArchiveTagMutation();

  const { moveToCollection, bulkEdit } = useBulkOperations();

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

  const { canUseUploadsView, loading, canCreateArchive } = useCanUseUploadsView();

  if (!canUseUploadsView) {
    if (!loading) {
      return <Redirect to={FALLBACK_PATH} />;
    }
    return <Loading />;
  }

  return (
    <div className='uploads-overview'>
      {canCreateArchive && (
        <Button onClick={createArchive}>
          <Add />
          {t('curator.createArchive')}
        </Button>
      )}
      <HideStats>
        <PictureScrollGrid
          queryParams={{ collections: { id: { null: true } } }}
          hashbase={'uploads'}
          uploadAreaProps={uploadAreaProps}
          bulkOperations={[moveToCollection, bulkEdit]}
        />
      </HideStats>
    </div>
  );
};
export default UploadsView;
