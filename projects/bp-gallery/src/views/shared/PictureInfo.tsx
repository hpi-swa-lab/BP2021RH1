import React from 'react';
import { Icon } from '@mui/material';
import dayjs from 'dayjs';
import { FlatPicture, FlatTimeRangeTag } from '../../graphql/additionalFlatTypes';
import PictureDetails from './PictureDetails';

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

const PictureInfo = ({ picture, children }: { picture: FlatPicture; children: any }) => {
  return (
    <div className='scrollbar-container'>
      <div className='picture-infos'>
        <div className='title'>
          <Icon style={{ marginRight: '0.5rem' }}>today</Icon>
          <span>{formatTimeStamp(picture.time_range_tag ?? undefined)}</span>
        </div>
        <PictureDetails descriptions={picture.descriptions} />
        {children}
      </div>
    </div>
  );
};

export default PictureInfo;
