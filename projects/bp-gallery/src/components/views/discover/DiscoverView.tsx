import { useTranslation } from 'react-i18next';
import { useVisit } from '../../../helpers/history';
import { PictureOverviewType, TagType } from '../../../types/additionalFlatTypes';
import PictureOverview from '../../common/PictureOverview';
import TagOverview from '../../common/TagOverview';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './DiscoverView.scss';
import OverviewContainer, {
  OverviewContainerPosition,
  OverviewContainerTab,
} from '../../common/OverviewContainer';
import { AccessTime, ThumbUp } from '@mui/icons-material';
import { useMemo } from 'react';
import { ExhibitionOverview } from '../exhibitions/ExhibitionOverview';

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

  return (
    <div className='discover-container'>
      <ShowStats>
        <OverviewContainer tabs={tabs} overviewPosition={OverviewContainerPosition.DISCOVER_VIEW} />
        <div className='flex flex-col my-4'>
          <h2 className='m-2'>{t('exhibition.overview.our-exhibitions')}</h2>
          <ExhibitionOverview archiveId={undefined} />
        </div>
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
