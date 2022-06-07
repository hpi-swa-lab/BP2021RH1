import React, { useMemo } from 'react';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import './UploadsView.scss';
import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import ScrollContainer from '../../common/ScrollContainer';

const UploadsView = () => {
  const { role } = useAuth();
  const { t } = useTranslation();

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
  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='uploads-overview'>
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
