import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNoDistractionModeStyle } from '../helpers/no-distraction-mode-style';
import './PictureToolbar.scss';

export const PictureToolbar = ({ calledViaLink }: { calledViaLink: boolean }) => {
  const { t } = useTranslation();

  const onBack = () => {
    window.history.back();
  };

  const noDistractionModeStyle = useNoDistractionModeStyle();

  return (
    <div className={`picture-toolbar ${noDistractionModeStyle}`}>
      <Button onClick={calledViaLink ? () => (location.href = '/browse') : onBack}>
        <ArrowBack />
        {calledViaLink ? t('common.back-to-home') : t('common.back')}
      </Button>
      <div className='bh-logo'>
        <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' />
      </div>
    </div>
  );
};
