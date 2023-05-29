import { Close, Done } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogProps } from '../DialogProvider';

const AddUserDialogPreset = ({
  dialogProps,
  handleClose,
}: {
  dialogProps: DialogProps;
  handleClose: (value: any) => void;
}) => {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  return (
    <>
      <DialogTitle>{dialogProps.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogProps.content}</DialogContentText>
        <Stack gap={4} className='mt-2'>
          <TextField
            label={t('admin.user.name')}
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <TextField
            label={t('admin.user.email')}
            type='email'
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleClose(undefined)} startIcon={<Close />}>
          {t('common.abort')}
        </Button>
        <Button
          onClick={() =>
            handleClose({
              username,
              email,
            })
          }
          startIcon={<Done />}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </>
  );
};

export default AddUserDialogPreset;
