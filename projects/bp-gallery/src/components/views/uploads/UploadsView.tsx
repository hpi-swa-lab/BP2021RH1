import React, { useMemo } from 'react';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../wrapper/AuthWrapper';
import './UploadsView.scss';
import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations';
import ScrollContainer from '../../common/ScrollContainer';

const UploadsView = () => {
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
