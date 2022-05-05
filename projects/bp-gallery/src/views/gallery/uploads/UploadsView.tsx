import React, { useMemo } from 'react';
import PictureScrollGrid from '../shared/PictureScrollGrid';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import './UploadsView.scss';
import { useTranslation } from 'react-i18next';
import useBulkOperations from '../shared/bulk-operations';

const UploadsView = ({ scrollPos, scrollHeight }: { scrollPos: number; scrollHeight: number }) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const { moveToCollection } = useBulkOperations();

  const uploadAreaProps = useMemo(() => {
    return role >= AuthRole.CURATOR
      ? {
          preprocessPictures: (pictures: FlatPicture[]) => {
            return pictures.map(picture => ({
              ...picture,
              publishedAt: new Date().toISOString(),
            }));
          },
          folderName: t('curator.uploads'),
        }
      : undefined;
  }, [role, t]);
  return (
    <div className='uploads-overview'>
      <PictureScrollGrid
        filters={{ collections: { id: { null: true } } }}
        scrollPos={scrollPos}
        scrollHeight={scrollHeight}
        hashbase={'uploads'}
        uploadAreaProps={uploadAreaProps}
        bulkOperations={[moveToCollection]}
      />
    </div>
  );
};
export default UploadsView;
