import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CollectionSelectDialogPreset from './dialog-presets/CollectionSelectDialogPreset';
import StatelessDialogPreset from './dialog-presets/StatelessDialogPreset';
import { Dialog } from '@mui/material';
import InputFieldDialogPreset from './dialog-presets/InputFieldDialogPreset';

export interface DialogOption {
  name: string;
  icon?: string;
  value: any;
  color?: string;
}

export enum DialogPreset {
  NO_PRESET,
  CONFIRM,
  SELECT_COLLECTION,
  INPUT_FIELD,
}

export interface DialogProps {
  preset?: DialogPreset;
  content?: any;
  title?: string;
  options?: DialogOption[];
}

export const DialogContext = React.createContext<(dialogProps: DialogProps) => Promise<any | null>>(
  async (dialogProps: DialogProps) => null
);

const DialogWrapper = ({ children }: { children: any }) => {
  const [dialogState, setDialogState] = useState<DialogProps>();

  // We save a function callback here to call once the currently active dialog has
  // been closed. The resolve function is set below where prompt is triggered
  const resolve = useRef<undefined | ((value: any) => void)>(undefined);
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (value: any) => {
    setOpen(false);
    if (resolve.current) {
      resolve.current(value);
      resolve.current = undefined;
    }
  };

  const prompt = ({
    preset = DialogPreset.NO_PRESET,
    content,
    title,
    options,
  }: DialogProps): Promise<any> => {
    if (preset === DialogPreset.CONFIRM) {
      options = [
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
    } else if (preset === DialogPreset.INPUT_FIELD) {
      options = [
        {
          name: t('common.abort'),
          value: undefined,
          icon: 'close',
        },
        {
          name: t('common.confirm'),
          value: true,
          icon: 'done',
        },
      ];
    }
    setDialogState({ preset, content, title, options });
    setOpen(true);
    return new Promise<any>(r => {
      // The callback function of this Promise is saved to the ref here
      resolve.current = r;
    });
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
        {(dialogState?.preset === DialogPreset.NO_PRESET ||
          dialogState?.preset === DialogPreset.CONFIRM) && (
          <StatelessDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.SELECT_COLLECTION && (
          <CollectionSelectDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.INPUT_FIELD && (
          <InputFieldDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogWrapper;
