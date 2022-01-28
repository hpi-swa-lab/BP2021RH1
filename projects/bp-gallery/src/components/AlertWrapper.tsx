import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

export enum AlertType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface AlertOptions {
  open: boolean;
  message: string;
  alertType: AlertType;
  duration?: number;
}

export const AlertContext = React.createContext<(alertOptions: AlertOptions) => void>(
  (alertOptions: AlertOptions) => {}
);

const AlertWrapper = ({ children }: { children: any }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [hideAfter, setHideAfter] = useState<number>(2000);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.SUCCESS);
  const [message, setMessage] = useState<string>('');

  const setAlertOptions = (alertOptions: AlertOptions) => {
    setMessage(alertOptions.message);
    setAlertType(alertOptions.alertType);
    if (alertOptions.duration) setHideAfter(alertOptions.duration);
    setOpen(alertOptions.open);
  };

  return (
    <AlertContext.Provider value={setAlertOptions}>
      <Snackbar
        open={open}
        autoHideDuration={hideAfter}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alertType}>{message}</Alert>
      </Snackbar>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertWrapper;
