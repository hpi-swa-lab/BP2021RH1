import { useState } from 'react';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGetPictures, { TextFilter } from '../../../hooks/get-pictures.hook';
import { FlatPicture, PictureOverviewType } from '../../../types/additionalFlatTypes';
import Loading from '../Loading';
import HorizontalPictureGrid from './HorizontalPictureGrid';
import PictureTimeline, { TimeStepType } from './PictureTimeline';

const TimelineComponent = ({
  defaultValue,
  timeStep = TimeStepType.YEAR,
  start,
  end,
}: {
  defaultValue: number;
  timeStep?: TimeStepType;
  start?: number;
  end?: number;
}) => {
  const [date, setDate] = useState<number>(defaultValue);

  const oldestResult = useGetPictures(
    {
      time_range_tag: { start: { ne: null } },
    },
    false,
    ['time_range_tag.start:asc'],
    TextFilter.ONLY_PICTURES,
    1,
    'no-cache',
    PictureOverviewType.CUSTOM
  );

  const oldestPictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(
    oldestResult.data
  )?.pictures;

  const lowerBound =
    oldestPictures && oldestPictures.length > 0
      ? new Date(oldestPictures[0].time_range_tag?.start as Date).getFullYear()
      : defaultValue;
  const upperBound = new Date(Date.now()).getFullYear();

  if (oldestResult.loading) {
    return <Loading />;
  } else {
    return (
      <div>
        <PictureTimeline
          start={start ?? lowerBound}
          end={end ?? upperBound}
          type={timeStep}
          date={date}
          setDate={setDate}
        />
        <HorizontalPictureGrid date={date} setDate={setDate} allowClicks />
      </div>
    );
  }
};

export default TimelineComponent;
