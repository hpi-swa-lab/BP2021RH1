import React from 'react';
import CategoryCarousel from '../../common/CategoryCarousel';
import ScrollContainer from '../../common/ScrollContainer';
import { TagType } from '../../../types/additionalFlatTypes';
import './DiscoverView.scss';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import Carousel from '../../common/Carousel';
import { useTranslation } from 'react-i18next';

const DiscoverView = () => {
  const history: History = useHistory();
  const { t } = useTranslation();

  return (
    <ScrollContainer>
      <div className='discover-container'>
        <Carousel
          title={t('discover.our-pictures')}
          queryParams={{}}
          onClick={() => {
            history.push('/show-more/pictures', {
              showBack: true,
            });
          }}
        />
        <Carousel
          title={t('discover.more-info')}
          queryParams={{ collections: { name: { eq: 'Fragezeichen' } } }}
          onClick={() => {
            history.push('/show-more/pictures/Fragezeichen', {
              showBack: true,
            });
          }}
          rows={1}
        />

        <CategoryCarousel
          title={t('discover.decades')}
          type={TagType.TIME_RANGE}
          onClick={() => {
            history.push('/show-more/date', {
              showBack: true,
            });
          }}
          rows={2}
        />

        <CategoryCarousel
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

        <CategoryCarousel
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
