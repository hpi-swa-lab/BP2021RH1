import { useState } from 'react';
import HorizontalPictureGrid from './HorizontalPictureGrid';
import PictureTimeline, { TimeStepType } from './PictureTimeline';

const TimelineComponent = () => {
  const [date, setDate] = useState<number>(1950);

  return (
    <div>
      <PictureTimeline
        start={1900}
        end={1990}
        type={TimeStepType.YEAR}
        date={date}
        setDate={setDate}
      />
      <HorizontalPictureGrid date={date} setDate={setDate} allowClicks={true} />
    </div>
  );
};

export default TimelineComponent;
