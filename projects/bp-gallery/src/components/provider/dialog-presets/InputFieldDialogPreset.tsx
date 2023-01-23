import { DialogProps } from '../DialogProvider';
import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Close,
  Done,
} from 'mui';
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
