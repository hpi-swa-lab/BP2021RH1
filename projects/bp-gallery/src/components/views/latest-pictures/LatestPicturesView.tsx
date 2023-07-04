import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { ExhibitionIdContext } from '../../provider/ExhibitionProvider';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './LatestPicturesView.scss';

const LatestPicturesView = () => {
  const { linkToCollection, createSequence, bulkEdit, addToExhibition } = useBulkOperations();
  const { t } = useTranslation();
  const exhibitionId = useContext(ExhibitionIdContext);
  return (
    <div className='latest-pictures'>
      <h2>{t('common.latest-pictures')}</h2>
      {t('common.latest-pictures-info')}
      <ShowStats>
        <PictureScrollGrid
          hashbase={'latest'}
          bulkOperations={[
            linkToCollection,
            createSequence,
            bulkEdit,
            ...(exhibitionId ? [addToExhibition] : []),
          ]}
          queryParams={{}}
          maxNumPictures={500}
          showCount={false}
          textFilter={null}
        />
      </ShowStats>
    </div>
  );
};

export default LatestPicturesView;
