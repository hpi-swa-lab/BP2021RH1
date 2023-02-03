import { Button, Icon } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PictureViewContext } from '../PictureView';

const PictureViewNavigationBar = () => {
  const { t } = useTranslation();

  const { setSideBarOpen, sideBarOpen } = useContext(PictureViewContext);

  if (!setSideBarOpen) {
    return <div></div>;
  }

  return (
    <div className='quick-access-buttons'>
      <Button
        className={sideBarOpen ? 'selected' : ''}
        onClick={() => setSideBarOpen(!sideBarOpen)}
      >
        {sideBarOpen && (
          <span>
            <Icon>image</Icon>
            {t('common.showPicture')}
          </span>
        )}
        {!sideBarOpen && (
          <span>
            <Icon>info</Icon>
            {t('common.showInfo')}
          </span>
        )}
        <Icon className='exp-icon'>expand_less</Icon>
      </Button>
    </div>
  );
};

export default PictureViewNavigationBar;
