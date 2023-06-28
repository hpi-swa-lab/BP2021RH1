import { Checkbox, FormControlLabel } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

interface ArchiveInputFieldProps {
  defaultValue: boolean;
  id: string;
  onChange: (value: boolean) => void;
  label: string;
}

const ArchiveCheckboxField = ({ defaultValue, id, onChange, label }: ArchiveInputFieldProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <div className='archive-form-div'>
      <label className='archive-form-label' htmlFor={`archive-form-${id}`} />
      <FormControlLabel
        label={label}
        control={<Checkbox id={`archive-form-${id}`} checked={value} onChange={onCheckboxChange} />}
      />
    </div>
  );
};

export default ArchiveCheckboxField;
