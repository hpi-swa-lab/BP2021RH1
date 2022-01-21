import React from 'react';
import { Button, Icon } from '@mui/material';
import PictureNavigationButtons from './components/PictureNavigationButtons';
import { useTranslation } from 'react-i18next';

export enum PictureNavigationTarget {
  NEXT,
  PREVIOUS,
}

export const PictureViewUI = ({
  maxHeight,
  calledViaLink,
}: {
  maxHeight: string;
  calledViaLink: boolean;
}) => {
  const { t } = useTranslation();

  const onBack = () => {
    window.history.back();
  };

  return (
    <div className='picture-ui' style={{ maxHeight }}>
      <PictureNavigationButtons />
      <div className='picture-toolbar'>
        <Button onClick={calledViaLink ? () => (location.href = '/browse') : onBack}>
          <Icon>arrow_back</Icon>
          {calledViaLink ? t('common.back-to-home') : t('common.back')}
        </Button>
        <div className={`bh-logo`}>
          <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
        </div>
      </div>
    </div>
  );
};

export default PictureViewUI;
