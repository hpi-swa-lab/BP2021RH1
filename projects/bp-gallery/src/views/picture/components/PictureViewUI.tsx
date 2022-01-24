import React from 'react';
import { Button, Icon } from '@mui/material';
import PictureNavigationButtons from './PictureNavigationButtons';
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
        <Button onClick={onBack} style={{ visibility: calledViaLink ? 'hidden' : 'visible' }}>
          <Icon>arrow_back</Icon>
          {t('common.back')}
        </Button>
        <div
          className={`bh-logo`}
          title={t('common.back-to-home')}
          onClick={() => (calledViaLink ? (location.href = '/browse') : null)}
        >
          <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
        </div>
      </div>
    </div>
  );
};

export default PictureViewUI;
