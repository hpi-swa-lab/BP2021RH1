import { useTranslation } from 'react-i18next';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import ShowStats from '../../provider/ShowStatsProvider';
import './LatestPicturesView.scss';

const LatestPicturesView = () => {
  const { linkToCollection, bulkEdit, downloadCollection } = useBulkOperations();
  const { t } = useTranslation();

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='latest-pictures'>
          <h2>{t('common.latest-pictures')}</h2>
          {t('common.latest-pictures-info')}
          <ShowStats>
            <PictureScrollGrid
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={'latest'}
              bulkOperations={[linkToCollection, downloadCollection, bulkEdit]}
              queryParams={{}}
              maxNumPictures={500}
              showCount={false}
            />
          </ShowStats>
        </div>
      )}
    </ScrollContainer>
  );
};

export default LatestPicturesView;
