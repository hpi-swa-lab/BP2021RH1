import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Button } from '@mui/material';
import { ComponentProps, PropsWithChildren, useCallback } from 'react';

export const CheckboxButton = ({
  checked,
  onChange,
  children,
  ...props
}: PropsWithChildren<
  {
    checked: boolean;
    onChange: (checked: boolean) => void;
  } & Omit<ComponentProps<typeof Button>, 'onChange'>
>) => {
  const onClick = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);
  return (
    <Button
      onClick={onClick}
      startIcon={checked ? <CheckBox /> : <CheckBoxOutlineBlank />}
      variant='contained'
      {...props}
    >
      {children}
    </Button>
  );
};

export default CheckboxButton;
