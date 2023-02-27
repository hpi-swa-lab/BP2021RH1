import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  const onClick = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <IconButton onClick={onClick}>{checked ? <CheckBox /> : <CheckBoxOutlineBlank />}</IconButton>
  );
};

export default Checkbox;
