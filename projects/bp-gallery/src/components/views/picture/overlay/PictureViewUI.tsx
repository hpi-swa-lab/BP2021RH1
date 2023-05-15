import { PresentToAll } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../hooks/context-hooks';
import { AuthRole } from '../../../provider/AuthProvider';
import PictureNavigationButtons from './PictureNavigationButtons';
import { PictureToolbar } from './PictureToolbar';

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

  return (
    <div className='picture-ui'>
      <PictureNavigationButtons />
      <PictureToolbar calledViaLink={calledViaLink} />
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
          <PresentToAll />
          {t('common.presentationMode')}
        </Button>
      )}
    </div>
  );
};

export default PictureViewUI;
