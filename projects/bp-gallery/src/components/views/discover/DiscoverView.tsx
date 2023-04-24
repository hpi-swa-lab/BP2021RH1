import { useTranslation } from 'react-i18next';
import { useVisit } from '../../../helpers/history';
import { TagType } from '../../../types/additionalFlatTypes';
import PictureOverview from '../../common/PictureOverview';
import TagOverview from '../../common/TagOverview';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './DiscoverView.scss';

const DiscoverView = () => {
  const { visit } = useVisit();
  const { t } = useTranslation();

  return (
    <div className='discover-container'>
      <ShowStats>
        <PictureOverview
          title={t('discover.latest-pictures')}
          queryParams={{}}
          onClick={() => {
            visit('/show-more/latest');
          }}
        />
        <PictureOverview
          title={t('discover.more-info')}
          queryParams={{ collections: { name: { eq: 'Fragezeichen' } } }}
          onClick={() => {
            visit('/show-more/pictures/Fragezeichen');
          }}
          rows={1}
        />
      </ShowStats>

      <TagOverview
        title={t('discover.decades')}
        type={TagType.TIME_RANGE}
        onClick={() => {
          visit('/show-more/date');
        }}
        rows={2}
      />

      <TagOverview
        title={t('discover.locations')}
        type={TagType.LOCATION}
        queryParams={{
          and: [{ verified_pictures: { id: { not: { eq: '-1' } } } }, { visible: { eq: true } }],
        }}
        onClick={() => {
          visit('/show-more/location');
        }}
        rows={2}
      />

      <TagOverview
        title={t('discover.our-categories')}
        type={TagType.KEYWORD}
        queryParams={{
          and: [{ verified_pictures: { id: { not: { eq: '-1' } } } }, { visible: { eq: true } }],
        }}
        onClick={() => {
          visit('/show-more/keyword');
        }}
        rows={2}
      />
    </div>
  );
};

export default DiscoverView;
