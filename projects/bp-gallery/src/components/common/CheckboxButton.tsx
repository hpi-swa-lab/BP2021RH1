import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Button } from '@mui/material';
import { PropsWithChildren, useCallback } from 'react';

export const CheckboxButton = ({
  checked,
  onChange,
  children,
}: PropsWithChildren<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}>) => {
  const onClick = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);
  return (
    <Button
      onClick={onClick}
      startIcon={checked ? <CheckBox /> : <CheckBoxOutlineBlank />}
      variant='contained'
    >
      {children}
    </Button>
  );
};

export default CheckboxButton;
