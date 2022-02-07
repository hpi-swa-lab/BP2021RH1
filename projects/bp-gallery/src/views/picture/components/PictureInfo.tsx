import React, { useContext, useRef } from 'react';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import './PictureInfo.scss';
import { Icon } from '@mui/material';
import { PictureViewContext } from '../PictureView';
import dayjs from 'dayjs';
import PictureViewNavigationBar from './PictureViewNavigationBar';
import { FlatPicture, FlatTimeRangeTag } from '../../../graphql/additionalFlatTypes';
import { ApolloError } from '@apollo/client';
import Loading from '../../../components/Loading';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';

export const formatTimeStamp = (timeStamp?: FlatTimeRangeTag) => {
  if (!timeStamp?.start || !timeStamp.end) {
    return '---';
  }
  const duration = dayjs(timeStamp.end as string).diff(dayjs(timeStamp.start as string), 'days');
  if (duration === 0) {
    return dayjs(timeStamp.start as string).format('DD.MM.YYYY');
  } else if (duration > 27 && duration < 40) {
    return dayjs(timeStamp.start as string).format('MM.YYYY');
  } else if (duration > 350 && duration < 400) {
    return dayjs(timeStamp.start as string).format('YYYY');
  } else if (duration > 400 && duration < 3700) {
    return (
      dayjs(timeStamp.start as string)
        .format('YYYY')
        .slice(0, 3) + 'X'
    );
  } else if (duration >= 3700) {
    return '19XX';
  } else {
    return `${dayjs(timeStamp.start as string).format('DD.MM.YYYY')} - ${dayjs(
      timeStamp.end as string
    ).format('DD.MM.YYYY')}`;
  }
};

const PictureInfoContent = ({ picture }: { picture: FlatPicture }) => {
  return (
    <div className='scrollbar-container'>
      <div className='picture-infos'>
        <div className='title'>
          <Icon style={{ marginRight: '0.5rem' }}>today</Icon>
          <span>{formatTimeStamp(picture.time_range_tag ?? undefined)}</span>
        </div>
        <PictureDetails descriptions={picture.descriptions} />
        <CommentsContainer comments={picture.comments} pictureId={picture.id} />
      </div>
    </div>
  );
};

const PictureInfo = ({
  picture,
  loading,
  error,
}: {
  picture?: FlatPicture;
  pictureId: string;
  loading?: boolean;
  error?: ApolloError;
}) => {
  const { sideBarOpen } = useContext(PictureViewContext);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`picture-info-container${!sideBarOpen ? ' closed' : ''}`} ref={containerRef}>
      {loading && <Loading />}
      {error && <QueryErrorDisplay error={error} />}
      {!loading && !error && picture && <PictureInfoContent picture={picture} />}
      <PictureViewNavigationBar />
    </div>
  );
};

export default PictureInfo;
