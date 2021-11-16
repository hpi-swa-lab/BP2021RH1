import React, { useEffect, useState } from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './comments/CommentsContainer';
import Picture from './Picture';
import apiConnector from '../../ApiConnector';
import NavigationBar from '../../components/NavigationBar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';

const PictureView = ({ pictureId }: { pictureId: number }) => {
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
    loadPictureIntoState().then();
  }, [pictureId]);

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

  return (
    <>
      {!loadedPicture && <div>{t('common.loading')}</div>}
      {loadedPicture && (
        <PerfectScrollbar options={{ suppressScrollX: true, useBothWheelAxes: false }}>
          <div className='picture-view'>
            <Picture url={pictureUrl} />
            <PictureDetails details={pictureDetails} />
            <CommentsContainer comments={comments} />
          </div>
        </PerfectScrollbar>
      )}
      <NavigationBar elements={menuItems} />
    </>
  );
};

export default PictureView;
