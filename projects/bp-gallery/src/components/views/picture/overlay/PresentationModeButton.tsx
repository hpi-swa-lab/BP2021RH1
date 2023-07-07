import { PresentToAll } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNoDistractionModeStyle } from '../helpers/no-distraction-mode-style';

export const PresentationModeButton = ({
  pictureId,
  sessionId,
}: {
  pictureId: string;
  sessionId: string;
}) => {
  const { t } = useTranslation();

  const noDistractionModeStyle = useNoDistractionModeStyle();

  return (
    <Button
      className={`presentation-mode-button ${noDistractionModeStyle}`}
      onClick={() => {
        window.open(`/picture/${pictureId}?presentation=${sessionId}`, '_blank', 'fullscreen=1');
      }}
    >
      <PresentToAll />
      {t('common.presentationMode')}
    </Button>
  );
};
