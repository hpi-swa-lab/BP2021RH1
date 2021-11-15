import React, { useEffect, useState } from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './CommentsContainer';
import Picture from './Picture';
import apiConnector from '../../ApiConnector';
import NavigationBar from '../../components/NavigationBar';
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
      icon: '',
      target: '/picture/' + `${pictureId}`,
    },
    {
      name: t('common.details'),
      icon: '',
      target: '/picture/' + `${pictureId}`,
    },
    {
      name: t('common.comments'),
      icon: '',
      target: '/picture/' + `${pictureId}`,
    },
  ];

  return (
    <div>
      {!loadedPicture && <div>{t('common.loading')}</div>}
      {loadedPicture && (
        <div className='picture-view'>
          <Picture url={pictureUrl} />
          <PictureDetails details={pictureDetails} />
          <CommentsContainer comments={comments} />
        </div>
      )}
      <NavigationBar elements={menuItems} />
    </div>
  );
};

export default PictureView;
