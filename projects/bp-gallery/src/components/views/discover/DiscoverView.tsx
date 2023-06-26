import { AccessTime, ThumbUp, Widgets } from '@mui/icons-material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisit } from '../../../helpers/history';
import { PictureOverviewType, TagType } from '../../../types/additionalFlatTypes';
import OverviewContainer, {
  OverviewContainerPosition,
  OverviewContainerTab,
} from '../../common/OverviewContainer';
import PictureMap from '../../common/PictureMap';
import PictureOverview from '../../common/PictureOverview';
import TagOverview from '../../common/TagOverview';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './DiscoverView.scss';

const DiscoverView = () => {
  const { visit } = useVisit();
  const { t } = useTranslation();

  const tabs: OverviewContainerTab[] = useMemo(() => {
    return [
      {
        title: t('discover.latest-pictures'),
        icon: <AccessTime key='0' />,
        content: (
          <PictureOverview
            queryParams={{}}
            onClick={() => {
              visit('/show-more/latest');
            }}
          />
        ),
      },
      {
        title: t('discover.most-liked'),
        icon: <ThumbUp key='1' />,
        content: (
          <PictureOverview
            type={PictureOverviewType.MOST_LIKED}
            queryParams={{}}
            onClick={() => {
              visit('/show-more/most-liked');
            }}
          />
        ),
      },
    ];
  }, [t, visit]);

  const locationTabs: OverviewContainerTab[] = useMemo(() => {
    return [
      {
        title: 'Karte',
        icon: <AccessTime key='0' />,
        content: <PictureMap />,
      },
      {
        title: t('discover.locations'),
        icon: <Widgets key='1' />,
        content: (
          <TagOverview
            type={TagType.LOCATION}
            queryParams={{
              and: [
                { verified_pictures: { id: { not: { eq: '-1' } } } },
                { visible: { eq: true } },
              ],
            }}
            onClick={() => {
              visit('/show-more/location');
            }}
            rows={2}
          />
        ),
      },
    ];
  }, [t, visit]);

  return (
    <div className='discover-container'>
      <ShowStats>
        <OverviewContainer tabs={tabs} overviewPosition={OverviewContainerPosition.DISCOVER_VIEW} />

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

      <OverviewContainer
        tabs={locationTabs}
        overviewPosition={OverviewContainerPosition.DISCOVER_VIEW}
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
