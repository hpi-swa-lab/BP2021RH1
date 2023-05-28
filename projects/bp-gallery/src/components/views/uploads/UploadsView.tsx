import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { useCanUseUploadsView } from '../../../hooks/can-do-hooks';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import ProtectedRoute from '../../common/ProtectedRoute';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { HideStats } from '../../provider/ShowStatsProvider';
import { AddArchiveButton } from '../admin/archive/AddArchiveButton';
import './UploadsView.scss';

const UploadsView = () => {
  const { t } = useTranslation();

  const { moveToCollection, bulkEdit } = useBulkOperations();

  const uploadAreaProps = useMemo(
    () => ({
      // whether the user actually can upload the picture is handled in PictureUploadArea
      // No additional information added to the pictures in this view here.
      preprocessPictures: (pictures: FlatPicture[]) => pictures,
      folderName: t('curator.uploads'),
    }),
    [t]
  );

  const { canUseUploadsView, loading: canUseUploadsViewLoading } = useCanUseUploadsView();

  return (
    <ProtectedRoute canUse={canUseUploadsView} canUseLoading={canUseUploadsViewLoading}>
      <div className='uploads-overview'>
        <AddArchiveButton />
        <HideStats>
          <PictureScrollGrid
            queryParams={{ collections: { id: { null: true } } }}
            hashbase={'uploads'}
            uploadAreaProps={uploadAreaProps}
            bulkOperations={[moveToCollection, bulkEdit]}
            textFilter={null}
          />
        </HideStats>
      </div>
    </ProtectedRoute>
  );
};
export default UploadsView;
