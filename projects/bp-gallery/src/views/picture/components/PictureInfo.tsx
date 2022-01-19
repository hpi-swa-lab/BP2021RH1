import React, { useContext, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import './PictureInfo.scss';
import { Icon, IconButton } from '@mui/material';
import { PictureViewContext } from '../PictureView';
import dayjs from 'dayjs';
import PictureViewNavigationBar, { FocusArea } from './PictureViewNavigationBar';
import { FlatPicture, FlatTimeRangeTag } from '../../../graphql/additionalFlatTypes';

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
  } else {
    return '19XX';
  }
};

const PictureInfo = ({
  picture,
  pictureId,
  calculateHeight,
}: {
  picture: FlatPicture;
  pictureId: string;
  calculateHeight: (container: HTMLElement) => void;
}) => {
  const { sideBarOpen, setSideBarOpen } = useContext(PictureViewContext);
  const [focusedArea, setFocusedArea] = useState<FocusArea>(FocusArea.PICTURE);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`picture-info-container${!sideBarOpen ? ' closed' : ''}`} ref={containerRef}>
      <IconButton
        className='open-close-button'
        onClick={() => {
          if (setSideBarOpen) {
            setSideBarOpen(!sideBarOpen);
          }
        }}
      >
        <Icon>chevron_right</Icon>
      </IconButton>
      <PerfectScrollbar
        options={{ suppressScrollX: true, wheelPropagation: false }}
        onScrollY={container => {
          calculateHeight(container);
        }}
      >
        <div className='picture-infos'>
          <div className='title'>
            <Icon style={{ marginRight: '0.5rem' }}>today</Icon>
            <span>{formatTimeStamp(picture.time_range_tag ?? undefined)}</span>
          </div>
          <PictureDetails descriptions={picture.descriptions} />
          <CommentsContainer comments={picture.comments} pictureId={pictureId} />
        </div>
      </PerfectScrollbar>
      <PictureViewNavigationBar
        focusedArea={focusedArea}
        setFocusedArea={setFocusedArea}
        containerRef={containerRef}
      />
    </div>
  );
};

export default PictureInfo;
