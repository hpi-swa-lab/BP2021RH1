import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
} from '@mui/material';
import React from 'react';
import { DialogProps } from '../DialogProvider';

const StatelessDialogPreset = ({
  dialogProps,
  handleClose,
}: {
  dialogProps: DialogProps;
  handleClose: (value: any) => void;
}) => {
  return (
    <>
      <DialogTitle>{dialogProps.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogProps.content}</DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        {dialogProps.options?.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleClose(option.value)}
            style={{ color: option.color ?? undefined }}
            startIcon={option.icon ? <Icon>{option.icon}</Icon> : undefined}
          >
            {option.name}
          </Button>
        ))}
      </DialogActions>
    </>
  );
};

export default StatelessDialogPreset;
