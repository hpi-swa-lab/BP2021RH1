import React from 'react';
import CategoryCarousel from '../../common/CategoryCarousel';
import ScrollContainer from '../../common/ScrollContainer';
import { TagType } from '../../../types/additionalFlatTypes';
import './DiscoverView.scss';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import Carousel from '../../common/Carousel';

const DiscoverView = () => {
  const history: History = useHistory();
  return (
    <ScrollContainer>
      <div className='discover-container'>
        <Carousel
          title='Unsere Bilder'
          queryParams={{}}
          onClick={() => {
            history.push('/show-more/pictures', {
              showBack: true,
            });
          }}
        />
        <Carousel
          title='Wissen Sie mehr über diese Bilder?'
          queryParams={{ collections: { name: { eq: 'Fragezeichen' } } }}
          onClick={() => {
            history.push('/show-more/pictures/Fragezeichen', {
              showBack: true,
            });
          }}
          rows={1}
        />

        <CategoryCarousel
          title='Jahrzehnte'
          type={TagType.TIME_RANGE}
          separator={true}
          onClick={() => {
            history.push('/show-more/date', {
              showBack: true,
            });
          }}
          rows={2}
        />

        <CategoryCarousel
          title='Orte'
          separator={true}
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
          title='Unsere Kategorien'
          separator={true}
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
