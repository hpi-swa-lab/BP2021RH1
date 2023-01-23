import React from 'react';
import { MenuItem, TextField } from 'mui';

interface TagMultiSelectProps {
  values: any[];
  selectedValues: any[];
  onValueChange: (values: Array<any>) => void;
  onSelectClose: (event: React.SyntheticEvent) => void;
  label?: string;
  disabled?: boolean;
}

const TagMultiSelect = ({
  values,
  selectedValues,
  onValueChange,
  onSelectClose,
  label = '',
  disabled = false,
}: TagMultiSelectProps) => (
  <TextField
    select
    SelectProps={{ multiple: true, onClose: onSelectClose }}
    disabled={disabled}
    label={label}
    value={selectedValues}
    onChange={evt => onValueChange(evt.target.value as unknown as Array<any>)}
  >
    {values.map(value => (
      <MenuItem key={value.id} value={value} divider>
        {value.name}
      </MenuItem>
    ))}
  </TextField>
);

export default TagMultiSelect;
