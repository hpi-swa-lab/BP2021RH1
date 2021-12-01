import React, { useEffect, useMemo, useState } from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import apiConnector from '../../ApiConnector';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { apiBase } from '../../App';

const PictureView = ({
  pictureId,
  thumbnailUrl = '',
  thumbnailMode = false,
}: {
  pictureId: number;
  thumbnailUrl?: string;
  thumbnailMode: boolean;
}) => {
  const { t } = useTranslation();
  const history: History = useHistory();

  const [loadedPicture, setLoadedPicture] = useState<boolean>(false);
  const [pictureUrl, setPictureUrl] = useState<string>('');
  const [pictureDetails, setPictureDetails] = useState<any | undefined>(undefined);
  const [comments, setComments] = useState<any | undefined>(undefined);

  //Loads the information about a picture into state
  useEffect(() => {
    if (!thumbnailMode) {
      apiConnector.getPicture(pictureId).then(pictureInfo => {
        setPictureUrl(pictureInfo.url as string);
        setPictureDetails(pictureInfo.details);
        setComments(pictureInfo.comments);
        setLoadedPicture(true);
      });
    }
  }, [pictureId, thumbnailMode]);

  //   const menuItems = [
  //     {
  //       name: t('common.picture'),
  //       icon: 'photo',
  //       target: '/picture/' + `${pictureId}`,
  //     },
  //     {
  //       name: t('common.details'),
  //       icon: 'info',
  //       target: '/picture/' + `${pictureId}`,
  //     },
  //     {
  //       name: t('common.comments'),
  //       icon: 'comment',
  //       target: '/picture/' + `${pictureId}`,
  //     },
  //   ];

  const [scrollPos, setScrollPos] = useState<number>();
  const [imageHeightRef, setImageHeightRef] = useState<number>(0.65 * window.innerHeight);

  const parallaxPosition = useMemo(() => {
    if (thumbnailMode) {
      return window.innerHeight * 0.65;
    }
    return Math.max(window.innerHeight * 0.65 - (scrollPos ?? 0), imageHeightRef);
  }, [scrollPos, thumbnailMode, imageHeightRef]);

  if (thumbnailMode) {
    return (
      <img
        src={apiBase + thumbnailUrl}
        onClick={() => {
          history.push(`/picture/${String(pictureId)}`, { showBack: true });
        }}
      />
    );
  } else if (!loadedPicture) {
    return <div>{t('common.loading')}</div>;
  } else {
    return (
      <div className='picture-view'>
        <Picture url={pictureUrl} scrollPos={scrollPos} ref={setImageHeightRef} />
        <div className={'parallax-container'} style={{ top: `${parallaxPosition}px` }}>
          <div className={'picture-background'}></div>
          <div className='title'>{pictureDetails.title.text}</div>
        </div>

        <PerfectScrollbar
          options={{ suppressScrollX: true, useBothWheelAxes: false }}
          onScrollY={container => {
            setScrollPos(container.scrollTop);
          }}
        >
          <div className={'picture-info-container'}>
            <PictureDetails details={pictureDetails} />
            <CommentsContainer comments={comments} />
          </div>
        </PerfectScrollbar>
      </div>
    );
  }
};

export default PictureView;
