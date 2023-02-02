import React from 'react';
import { Button, CheckBox, CheckBoxOutlineBlank } from 'mui';
import { useCallback } from 'react';

export const CheckboxButton: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
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
