import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface DialogOption {
  name: string;
  icon?: string;
  value: any;
  color?: string;
}

export enum DialogPreset {
  CONFIRM,
}

export interface DialogProps {
  title?: string;
  content: any;
  preset?: DialogPreset;
  options?: DialogOption[];
}

export const DialogContext = React.createContext<(dialogProps: DialogProps) => Promise<any | null>>(
  async (dialogProps: DialogProps) => null
);

const DialogWrapper = ({ children }: { children: any }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<DialogProps>();

  // We save a function callback here to call once the currently active dialog has
  // been closed. The resolve function is set below where prompt is triggered
  const resolve = useRef<undefined | ((value: any) => void)>(undefined);
  const { t } = useTranslation();

  const prompt = (dialogProps: DialogProps): Promise<any> => {
    if (dialogProps.preset === DialogPreset.CONFIRM && !dialogProps.options) {
      dialogProps.options = [
        {
          name: t('common.abort'),
          value: false,
          icon: 'close',
        },
        {
          name: t('common.confirm'),
          value: true,
          icon: 'done',
        },
      ];
    }
    setDialogState(dialogProps);
    setOpen(true);
    return new Promise<any>(r => {
      // The callback function of this Promise is saved to the ref here
      resolve.current = r;
    });
  };

  const handleClose = (value: any) => {
    setOpen(false);
    if (resolve.current) {
      resolve.current(value);
      resolve.current = undefined;
    }
  };

  return (
    <DialogContext.Provider value={prompt}>
      {children}
      <Dialog
        open={open}
        onClose={() => {
          // If we close the dialog by clicking outside its boundaries, it as treated
          // as if we didn't choose any of the options - hence null
          handleClose(null);
        }}
      >
        <DialogTitle>{dialogState?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogState?.content}</DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          {dialogState?.options?.map((option, index) => (
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
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogWrapper;
