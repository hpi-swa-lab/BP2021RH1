import React, { useEffect, useMemo, useRef, useState } from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import apiConnector, { apiBase } from '../../ApiConnector';
import NavigationBar from '../../components/NavigationBar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { useHistory } from 'react-router-dom';

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

  const menuItems = [
    {
      name: t('common.picture'),
      icon: 'photo',
      target: '/picture/' + `${pictureId}`,
    },
    {
      name: t('common.details'),
      icon: 'info',
      target: '/picture/' + `${pictureId}`,
    },
    {
      name: t('common.comments'),
      icon: 'comment',
      target: '/picture/' + `${pictureId}`,
    },
  ];
  const [scrollPos, setScrollPos] = useState<number>();
  const [scrollHeight, setScrollHeight] = useState<number>();
  const imageRef = useRef<HTMLImageElement>(null);

  const parallaxPosition = useMemo(() => {
    if (thumbnailMode || !(imageRef as any)?.current) {
      return window.innerHeight * 0.65; ///
    }
    const rect = (imageRef as any).current.getBoundingClientRect();
    return Math.max(-(scrollPos ?? 0) + window.innerHeight * 0.65, rect.height);
  }, [scrollPos, thumbnailMode]);

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
        <Picture
          url={pictureUrl}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
          ref={imageRef}
        />
        <div className={'parallax-container'} style={{ top: `${parallaxPosition}px` }}>
          <div className={'picture-background'}></div>
          <div className='title'>{pictureDetails.title.text}</div>
        </div>

        <PerfectScrollbar
          options={{ suppressScrollX: true, useBothWheelAxes: false }}
          onScrollY={container => {
            setScrollPos(container.scrollTop);
            setScrollHeight(container.scrollHeight);
          }}
        >
          <div className={'picture-info-container'}>
            <PictureDetails details={pictureDetails} />
            <CommentsContainer comments={comments} />
          </div>
        </PerfectScrollbar>
        <NavigationBar elements={menuItems} />
      </div>
    );
  }
};

export default PictureView;
