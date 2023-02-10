import { DialogProps } from '../DialogProvider';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { Close, Done } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const InputFieldDialogPreset = ({
  dialogProps,
  handleClose,
}: {
  dialogProps: DialogProps;
  handleClose: (value: any) => void;
}) => {
  const [textInput, setTextInput] = useState<string>('');
  const { t } = useTranslation();

  return (
    <>
      <DialogTitle>{dialogProps.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogProps.content}</DialogContentText>
        <TextField value={textInput} onChange={event => setTextInput(event.target.value)} />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleClose(undefined)} startIcon={<Close />}>
          {t('common.abort')}
        </Button>
        <Button onClick={() => handleClose(textInput)} startIcon={<Done />}>
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </>
  );
};

export default InputFieldDialogPreset;
