import React, { useEffect, useState } from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import apiConnector, { apiBase } from '../../ApiConnector';
import NavigationBar from '../../components/NavigationBar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
//import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const PictureView = ({
  pictureId,
  thumbnailUrl = '',
  thumbnailMode = true,
}: {
  pictureId: number;
  thumbnailUrl?: string;
  thumbnailMode: boolean;
}) => {
  const { t } = useTranslation();

  const [loadedPicture, setLoadedPicture] = useState<boolean>(false);
  const [pictureUrl, setPictureUrl] = useState<string>('');
  const [pictureDetails, setPictureDetails] = useState<any | undefined>(undefined);
  const [comments, setComments] = useState<any | undefined>(undefined);

  useEffect(() => {
    async function loadPictureIntoState(): Promise<void> {
      const pictureInfo = await apiConnector.getPicture(pictureId);

      setPictureUrl(pictureInfo.url as string);
      setPictureDetails(pictureInfo.details);
      setComments(pictureInfo.comments);
      setLoadedPicture(true);
    }
    if (!thumbnailMode) {
      loadPictureIntoState().then();
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

  if (thumbnailMode) {
    return <img src={apiBase + thumbnailUrl} />;
  } else if (!loadedPicture) {
    return <div>{t('common.loading')}</div>;
  } else {
    return (
      // <ParallaxProvider>
      <div className='picture-view'>
        <PerfectScrollbar options={{ suppressScrollX: true, useBothWheelAxes: false }}>
          {/*<Parallax>*/}
          <Picture url={pictureUrl} />
          <PictureDetails details={pictureDetails} />
          <CommentsContainer comments={comments} />
        </PerfectScrollbar>
        <NavigationBar elements={menuItems} />
        {/*</Parallax>*/}
      </div>
      // </ParallaxProvider>
    );
  }
};

export default PictureView;
