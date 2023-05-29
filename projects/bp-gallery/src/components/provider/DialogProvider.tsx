import { Close, Done } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import { PropsWithChildren, createContext, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddUserDialogPreset from './dialog-presets/AddUserDialogPreset';
import ArchiveTagSelectDialogPreset from './dialog-presets/ArchiveTagSelectDialogPreset';
import CollectionSelectDialogPreset from './dialog-presets/CollectionSelectDialogPreset';
import InputFieldDialogPreset from './dialog-presets/InputFieldDialogPreset';
import StatelessDialogPreset from './dialog-presets/StatelessDialogPreset';

export interface DialogOption {
  name: string;
  icon?: JSX.Element;
  value: any;
  color?: string;
}

export enum DialogPreset {
  NO_PRESET,
  CONFIRM,
  SELECT_COLLECTION,
  SELECT_ARCHIVE_TAG,
  INPUT_FIELD,
  ADD_USER,
}

export interface DialogProps {
  preset?: DialogPreset;
  content?: any;
  title?: string;
  options?: DialogOption[];
}

const DialogContext = createContext<(dialogProps: DialogProps) => Promise<any | null>>(
  async (dialogProps: DialogProps) => null
);

// eslint-disable-next-line react-refresh/only-export-components
export const useDialog = () => {
  return useContext(DialogContext);
};

const DialogProvider = ({ children }: PropsWithChildren<{}>) => {
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
          icon: <Close />,
        },
        {
          name: t('common.confirm'),
          value: true,
          icon: <Done />,
        },
      ];
    } else if (preset === DialogPreset.INPUT_FIELD) {
      options = [
        {
          name: t('common.abort'),
          value: undefined,
          icon: <Close />,
        },
        {
          name: t('common.confirm'),
          value: true,
          icon: <Done />,
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
        {dialogState?.preset === DialogPreset.SELECT_ARCHIVE_TAG && (
          <ArchiveTagSelectDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.INPUT_FIELD && (
          <InputFieldDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.ADD_USER && (
          <AddUserDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogProvider;
