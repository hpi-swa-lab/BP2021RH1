import { AccessTime, ThumbUp } from '@mui/icons-material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFlag } from '../../../helpers/growthbook';
import { useVisit } from '../../../helpers/history';
import { PictureOverviewType, TagType } from '../../../types/additionalFlatTypes';
import OverviewContainer, {
  OverviewContainerPosition,
  OverviewContainerTab,
} from '../../common/OverviewContainer';
import PictureOverview from '../../common/PictureOverview';
import TagOverview from '../../common/TagOverview';
import { ShowStats } from '../../provider/ShowStatsProvider';
import { ExhibitionOverview } from '../exhibitions/ExhibitionOverview';
import './DiscoverView.scss';

const DiscoverView = () => {
  const { visit } = useVisit();
  const { t } = useTranslation();

  const tabs: OverviewContainerTab[] = useMemo(() => {
    return [
      {
        title: t('discover.latest-pictures'),
        icon: <AccessTime key='0' />,
        content: <PictureOverview queryParams={{}} showMoreUrl='/show-more/latest' />,
      },
      {
        title: t('discover.most-liked'),
        icon: <ThumbUp key='1' />,
        content: (
          <PictureOverview
            type={PictureOverviewType.MOST_LIKED}
            queryParams={{}}
            showMoreUrl='/show-more/most-liked'
          />
        ),
      },
    ];
  }, [t]);
  const showStories = useFlag('showstories');
  return (
    <div className='discover-container'>
      <ShowStats>
        <OverviewContainer tabs={tabs} overviewPosition={OverviewContainerPosition.DISCOVER_VIEW} />
        {showStories && <ExhibitionOverview showTitle margin />}
        <PictureOverview
          title={t('discover.more-info')}
          queryParams={{ collections: { name: { eq: 'Fragezeichen' } } }}
          showMoreUrl='/show-more/pictures/Fragezeichen'
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
