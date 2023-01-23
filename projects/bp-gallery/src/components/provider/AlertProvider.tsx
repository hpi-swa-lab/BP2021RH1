import React, { useState } from 'react';
import { Close, Alert, IconButton, Snackbar } from 'mui';

export enum AlertType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface AlertOptions {
  message: string;
  alertType: AlertType;
  duration?: number;
}

export const AlertContext = React.createContext<(alertOptions: AlertOptions) => void>(
  (alertOptions: AlertOptions) => {}
);

const AlertProvider = ({ children }: { children: any }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [hideAfter, setHideAfter] = useState<number>(8000);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.INFO);
  const [message, setMessage] = useState<string>('');

  const openAlert = (alertOptions: AlertOptions) => {
    setMessage(alertOptions.message);
    setAlertType(alertOptions.alertType);
    if (alertOptions.duration) setHideAfter(alertOptions.duration);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={openAlert}>
      <Snackbar
        open={open}
        autoHideDuration={hideAfter}
        onClose={close}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alertType}
          action={
            <IconButton aria-label='close' color='inherit' size='small' onClick={close}>
              <Close fontSize='inherit' />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
