import { useState } from 'react';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGetPictures from '../../../hooks/get-pictures.hook';
import { FlatPicture, PictureOverviewType } from '../../../types/additionalFlatTypes';
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
    true,
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
      : 1900;
  const upperBound = new Date(Date.now()).getFullYear();

  return (
    <div>
      <PictureTimeline
        start={start ?? lowerBound}
        end={end ?? upperBound}
        type={timeStep}
        date={date}
        setDate={setDate}
      />
      <HorizontalPictureGrid date={date} setDate={setDate} allowClicks={true} />
    </div>
  );
};

export default TimelineComponent;
