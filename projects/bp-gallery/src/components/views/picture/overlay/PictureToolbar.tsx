import React from 'react';
import { Button, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './PictureToolbar.scss';

export const PictureToolbar = ({ calledViaLink }: { calledViaLink: boolean }) => {
  const { t } = useTranslation();

  const onBack = () => {
    window.history.back();
  };

  return (
    <div className='picture-toolbar'>
      <Button onClick={calledViaLink ? () => (location.href = '/browse') : onBack}>
        <Icon>arrow_back</Icon>
        {calledViaLink ? t('common.back-to-home') : t('common.back')}
      </Button>
      <div className='bh-logo'>
        <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
      </div>
    </div>
  );
};