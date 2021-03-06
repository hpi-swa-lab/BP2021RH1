import React, { useCallback, useContext, useMemo } from 'react';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import './UploadsView.scss';
import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import ScrollContainer from '../../common/ScrollContainer';
import { Button, Icon } from '@mui/material';
import { DialogContext, DialogPreset } from '../../provider/DialogProvider';
import { useCreateArchiveTagMutation } from '../../../graphql/APIConnector';

const UploadsView = () => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const dialog = useContext(DialogContext);

  const [createArchiveTagMutation] = useCreateArchiveTagMutation();

  const { moveToCollection } = useBulkOperations();

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
            <Icon>add</Icon>
            {t('curator.createArchive')}
          </Button>
          <PictureScrollGrid
            queryParams={{ collections: { id: { null: true } } }}
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={'uploads'}
            uploadAreaProps={uploadAreaProps}
            bulkOperations={[moveToCollection]}
          />
        </div>
      )}
    </ScrollContainer>
  );
};
export default UploadsView;
