import React from 'react';
import { Button, Icon } from '@mui/material';
import PictureNavigationButtons from './PictureNavigationButtons';
import { useTranslation } from 'react-i18next';
import { AuthRole, useAuth } from '../../../wrapper/AuthWrapper';

export const PictureViewUI = ({
  calledViaLink,
  pictureId,
  sessionId,
}: {
  calledViaLink: boolean;
  pictureId: string;
  sessionId: string;
}) => {
  const { t } = useTranslation();
  const { role } = useAuth();

  const onBack = () => {
    window.history.back();
  };

  return (
    <div className='picture-ui'>
      <PictureNavigationButtons />
      <div className='picture-toolbar'>
        <Button onClick={calledViaLink ? () => (location.href = '/browse') : onBack}>
          <Icon>arrow_back</Icon>
          {calledViaLink ? t('common.back-to-home') : t('common.back')}
        </Button>
        <div className='bh-logo'>
          <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
        </div>
      </div>
      {role >= AuthRole.CURATOR && (
        <Button
          className='presentation-mode-button'
          onClick={() => {
            window.open(
              `/picture/${pictureId}?presentation=${sessionId}`,
              '_blank',
              'fullscreen=1'
            );
          }}
        >
          <Icon>present_to_all</Icon>
          {t('common.presentationMode')}
        </Button>
      )}
    </div>
  );
};

export default PictureViewUI;
