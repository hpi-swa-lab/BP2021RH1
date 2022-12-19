import { OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ArchiveInputFieldProps {
  defaultValue: string;
  id: string;
  onBlur: (value: string, status?: string) => void;
  onChange?: (value: string, status?: string) => void;
  placeholder?: string;
  label?: string;
  regEx?: string;
  type?: string;
}

const ArchiveInputField = ({
  defaultValue,
  id,
  onBlur,
  onChange,
  placeholder,
  label,
  regEx,
  type = 'text',
}: ArchiveInputFieldProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className='archive-form-div'>
      <label className='archive-form-label' htmlFor={`archive-form-${id}`}>
        {label}
      </label>
      <OutlinedInput
        className='archive-form-input'
        id={`archive-form-${id}`}
        placeholder={placeholder}
        name={id}
        type={type}
        onChange={event => setValue(event.target.value)}
        inputProps={{
          onBlur: () => onBlur(value),
        }}
        value={value}
      />
    </div>
  );
};

export default ArchiveInputField;
