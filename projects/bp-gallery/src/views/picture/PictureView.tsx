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

  const [picture, setPicture] = useState<string | undefined>(undefined);
  //const [pictureDetails, setPictureDetails] = useState(null);
  //const [comments, setComments] = useState(null);

  useEffect(() => {
    async function loadPictureIntoState(): Promise<void> {
      const pictureInfo = await apiConnector.getPicture(pictureId);
      console.log(pictureInfo[0].media.url);
      setPicture(pictureInfo[0].media.url as string);
    }
    loadPictureIntoState().then();
  }, [pictureId]);

  const menuItems = [
    {
      name: t('common.picture'),
      icon: '',
      target: '',
    },
    {
      name: t('common.details'),
      icon: '',
      target: '',
    },
    {
      name: t('common.comments'),
      icon: '',
      target: '',
    },
  ];

  const changeView = () => {
    switch (picture) {
      case null:
        return 'Test';
      default:
        return (
          <div>
            {picture && <Picture pictureInfo={picture} />}
            <PictureDetails />
            <CommentsContainer />
          </div>
        );
    }
  };

  return (
    <div>
      {changeView()}
      <NavigationBar elements={menuItems} />
    </div>
  );
};

export default PictureView;
