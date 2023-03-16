import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateArchiveTagMutation } from '../../../graphql/APIConnector';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { ShowPfactz } from '../../common/picture-gallery/PicturePreview';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
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

  if (role < AuthRole.CURATOR) return null;
  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='uploads-overview'>
          <Button onClick={createArchive}>
            <Add />
            {t('curator.createArchive')}
          </Button>
          <ShowPfactz>
            <PictureScrollGrid
              queryParams={{ collections: { id: { null: true } } }}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={'uploads'}
              uploadAreaProps={uploadAreaProps}
              bulkOperations={[moveToCollection, bulkEdit]}
            />
          </ShowPfactz>
        </div>
      )}
    </ScrollContainer>
  );
};
export default UploadsView;
