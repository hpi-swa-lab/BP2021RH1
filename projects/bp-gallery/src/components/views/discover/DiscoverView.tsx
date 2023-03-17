import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TagType } from '../../../types/additionalFlatTypes';
import PictureOverview from '../../common/PictureOverview';
import ScrollContainer from '../../common/ScrollContainer';
import TagOverview from '../../common/TagOverview';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './DiscoverView.scss';

const DiscoverView = () => {
  const history: History = useHistory();
  const { t } = useTranslation();

  return (
    <ScrollContainer>
      <div className='discover-container'>
        <ShowStats>
          <PictureOverview
            title={t('discover.our-pictures')}
            queryParams={{}}
            onClick={() => {
              history.push('/show-more/pictures', {
                showBack: true,
              });
            }}
          />
          <PictureOverview
            title={t('discover.more-info')}
            queryParams={{ collections: { name: { eq: 'Fragezeichen' } } }}
            onClick={() => {
              history.push('/show-more/pictures/Fragezeichen', {
                showBack: true,
              });
            }}
            rows={1}
          />
        </ShowStats>

        <TagOverview
          title={t('discover.decades')}
          type={TagType.TIME_RANGE}
          onClick={() => {
            history.push('/show-more/date', {
              showBack: true,
            });
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
            history.push('/show-more/location', {
              showBack: true,
            });
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
            history.push('/show-more/keyword', {
              showBack: true,
            });
          }}
          rows={2}
        />
      </div>
    </ScrollContainer>
  );
};

export default DiscoverView;
