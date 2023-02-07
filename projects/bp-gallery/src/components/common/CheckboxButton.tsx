import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback } from 'react';

export const CheckboxButton: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}> = ({ checked, onChange, children }) => {
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
