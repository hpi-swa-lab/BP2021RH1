import dayjs from 'dayjs';
import { FlatTimeRangeTag } from '../../../graphql/additionalFlatTypes';

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
