import React, { useContext, useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import './PictureInfo.scss';
import { Button, Icon, IconButton } from '@mui/material';
import { PictureViewContext } from '../PictureView';
import { useTranslation } from 'react-i18next';
import { FlatPicture, FlatTimeRangeTag } from '../../../graphql/additionalFlatTypes';
import dayjs from 'dayjs';

const PictureInfo = ({
  picture,
  pictureId,
  calculateHeight,
}: {
  picture: FlatPicture;
  pictureId: string;
  calculateHeight: (container: HTMLElement) => void;
}) => {
  const { t } = useTranslation();
  const { sideBarOpen, setSideBarOpen } = useContext(PictureViewContext);
  const [focusedArea, setFocusedArea] = useState<FocusArea>(FocusArea.PICTURE);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      let top = 0;
      if (focusedArea) {
        const target =
          containerRef.current.querySelectorAll(`.picture-info-section`)[focusedArea - 1];
        const rect = target.getBoundingClientRect();
        top =
          rect.top -
          (target.parentElement?.getBoundingClientRect().top ?? 0) +
          0.85 * window.innerHeight -
          256;
      }
      containerRef.current.querySelector('.ps')?.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }, [focusedArea]);

  const formatTimeStamp = (timeStamp?: FlatTimeRangeTag) => {
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
      <div className='quick-access-buttons mobile-only'>
        <Button
          className={focusedArea === FocusArea.PICTURE ? 'selected' : ''}
          onClick={() => setFocusedArea(FocusArea.PICTURE)}
        >
          <Icon>image</Icon>
          <span>{t('common.picture')}</span>
        </Button>
        <Button
          className={focusedArea === FocusArea.DETAILS ? 'selected' : ''}
          onClick={() => setFocusedArea(FocusArea.DETAILS)}
        >
          <Icon>info</Icon>
          <span>{t('common.details')}</span>
        </Button>
        <Button
          className={focusedArea === FocusArea.COMMENTS ? 'selected' : ''}
          onClick={() => setFocusedArea(FocusArea.COMMENTS)}
        >
          <Icon>question_answer</Icon>
          <span>{t('common.comments')}</span>
        </Button>
      </div>
    </div>
  );
};

export default PictureInfo;
