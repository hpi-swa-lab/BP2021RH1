import React from 'react';
import './LatestPicturesView.scss';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { useTranslation } from 'react-i18next';

const LatestPicturesView = () => {
  const { linkToCollection, multiEdit } = useBulkOperations();
  const { t } = useTranslation();

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='latest-pictures'>
          <h2>{t('common.latest-pictures')}</h2>
          {t('common.latest-pictures-info')}
          <PictureScrollGrid
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={'latest'}
            bulkOperations={[linkToCollection, multiEdit]}
            queryParams={{}}
            sortBy={['publishedAt:desc']}
            maxNumPictures={500}
            showCount={false}
          />
        </div>
      )}
    </ScrollContainer>
  );
};

export default LatestPicturesView;
