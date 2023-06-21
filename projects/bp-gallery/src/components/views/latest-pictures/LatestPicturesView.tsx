import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './LatestPicturesView.scss';

const LatestPicturesView = () => {
  const { linkToCollection, createSequence, bulkEdit } = useBulkOperations();
  const { t } = useTranslation();

  return (
    <div className='latest-pictures'>
      <h2>{t('common.latest-pictures')}</h2>
      {t('common.latest-pictures-info')}
      <ShowStats>
        <PictureScrollGrid
          hashbase={'latest'}
          bulkOperations={[linkToCollection, createSequence, bulkEdit]}
          queryParams={{}}
          maxNumPictures={500}
          showCount={false}
        />
      </ShowStats>
    </div>
  );
};

export default LatestPicturesView;
