import { ExpandLess, Image, Info } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PictureViewContext } from '../PictureView';
import { useNoDistractionModeStyle } from '../helpers/no-distraction-mode-style';

const PictureViewNavigationBar = () => {
  const { t } = useTranslation();

  const { setSideBarOpen, sideBarOpen } = useContext(PictureViewContext);

  const noDistractionModeStyle = useNoDistractionModeStyle();

  if (!setSideBarOpen) {
    return <div></div>;
  }

  return (
    <div className={`quick-access-buttons ${noDistractionModeStyle}`}>
      <Button
        className={sideBarOpen ? 'selected' : ''}
        onClick={() => setSideBarOpen(!sideBarOpen)}
      >
        {sideBarOpen && (
          <span>
            <Image />
            {t('common.showPicture')}
          </span>
        )}
        {!sideBarOpen && (
          <span>
            <Info />
            {t('common.showInfo')}
          </span>
        )}
        <ExpandLess className='exp-icon' />
      </Button>
    </div>
  );
};

export default PictureViewNavigationBar;
