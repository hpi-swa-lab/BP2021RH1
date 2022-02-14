import React, { useCallback, useContext, useState } from 'react';
import { useUnpublishPictureMutation } from '../../../graphql/APIConnector';
import { AlertContext, AlertType } from '../../../components/AlertWrapper';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const RemovePicture = ({ pictureId, onRemove }: { pictureId: string; onRemove: () => void }) => {
  const { t } = useTranslation();
  const openAlert = useContext(AlertContext);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [unpublishPicture] = useUnpublishPictureMutation({
    errorPolicy: 'all',
    variables: { pictureId },
  });

  const removePicture = useCallback(() => {
    setDialogOpen(false);
    unpublishPicture().then(({ errors }) => {
      if (errors) {
        const errorMessage = errors.map(error => error.message).join('\n');
        openAlert({ alertType: AlertType.ERROR, message: errorMessage, duration: 5000 });
      } else {
        onRemove();
        openAlert({
          alertType: AlertType.SUCCESS,
          message: t('remove.success'),
        });
      }
    });
  }, [unpublishPicture, onRemove, openAlert, t]);

  return (
    <>
      <IconButton onClick={() => setDialogOpen(true)}>
        <Icon>delete_forever</Icon>
        {t('remove.picture')}
      </IconButton>
      <Dialog open={dialogOpen} fullWidth={false} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          {t('remove.confirmation')}
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color='primary'>
              {t('common.cancel')}
            </Button>
            <Button onClick={removePicture}>{t('remove.picture')}</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemovePicture;
