import { Close, Done } from '@mui/icons-material';
import { Breakpoint, Dialog } from '@mui/material';
import { PropsWithChildren, createContext, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocationManagementDialogPreset from '../views/location-curating/LocationManagementDialog';
import PathPositionSelectDialogPreset from '../views/location-curating/SelectPathPositionDialog';
import TagSelectDialogPreset from '../views/location-curating/SelectTagDialog';
import { ScrollProvider } from './ScrollProvider';
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
  SELECT_LOCATION,
  INPUT_FIELD,
  SELECT_PATH_POSITION,
  LOCATION_MANAGEMENT,
}

export interface DialogProps {
  preset?: DialogPreset;
  content?: any;
  title?: string;
  options?: DialogOption[];
  maxWidth?: false | Breakpoint | undefined;
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
    maxWidth,
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
    setDialogState({ preset, content, title, options, maxWidth });
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
        maxWidth={dialogState?.maxWidth}
      >
        {(dialogState?.preset === DialogPreset.NO_PRESET ||
          dialogState?.preset === DialogPreset.CONFIRM) && (
          <StatelessDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.SELECT_COLLECTION && (
          <CollectionSelectDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.SELECT_LOCATION && (
          <TagSelectDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.SELECT_ARCHIVE_TAG && (
          <ArchiveTagSelectDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.INPUT_FIELD && (
          <InputFieldDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.SELECT_PATH_POSITION && (
          <PathPositionSelectDialogPreset dialogProps={dialogState} handleClose={handleClose} />
        )}
        {dialogState?.preset === DialogPreset.LOCATION_MANAGEMENT && (
          <ScrollProvider>
            <LocationManagementDialogPreset dialogProps={dialogState} handleClose={handleClose} />
          </ScrollProvider>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogProvider;
