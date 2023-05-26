import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './LatestPicturesView.scss';
import { useContext } from 'react';
import { ExhibitionIdContext } from '../../provider/ExhibitionProvider';

const LatestPicturesView = () => {
  const { linkToCollection, bulkEdit, addToExhibition } = useBulkOperations();
  const { t } = useTranslation();
  const exhibitionId = useContext(ExhibitionIdContext);
  return (
    <div className='latest-pictures'>
      <h2>{t('common.latest-pictures')}</h2>
      {t('common.latest-pictures-info')}
      <ShowStats>
        <PictureScrollGrid
          hashbase={'latest'}
          bulkOperations={
            exhibitionId
              ? [linkToCollection, bulkEdit, addToExhibition]
              : [linkToCollection, bulkEdit]
          }
          queryParams={{}}
          maxNumPictures={500}
          showCount={false}
        />
      </ShowStats>
    </div>
  );
};

export default LatestPicturesView;
