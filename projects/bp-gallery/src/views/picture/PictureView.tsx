import React, { useEffect, useState } from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import apiConnector, { apiBase } from '../../ApiConnector';
import NavigationBar from '../../components/NavigationBar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';

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

  if (thumbnailMode) {
    return <img src={apiBase + thumbnailUrl} />;
  } else if (!loadedPicture) {
    return <div>{t('common.loading')}</div>;
  } else {
    return (
      <div className='picture-view'>
        <PerfectScrollbar options={{ suppressScrollX: true, useBothWheelAxes: false }}>
          <Picture url={pictureUrl} />
          <PictureDetails details={pictureDetails} />
          <CommentsContainer comments={comments} />
        </PerfectScrollbar>
        <NavigationBar elements={menuItems} />
      </div>
    );
  }
};

export default PictureView;
