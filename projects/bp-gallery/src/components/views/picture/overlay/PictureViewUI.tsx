import { Button, Icon } from '@mui/material';
import PictureNavigationButtons from './PictureNavigationButtons';
import { useTranslation } from 'react-i18next';
import { AuthRole, useAuth } from '../../../provider/AuthProvider';
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
          <Icon>present_to_all</Icon>
          {t('common.presentationMode')}
        </Button>
      )}
    </div>
  );
};

export default PictureViewUI;
