import { FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import React from 'react';

interface ArchiveInputProps {
  value: string;
  id: string;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  placeholder?: string;
  helperText?: string;
  type?: string;
}

const ArchiveInput = ({
  value,
  id,
  onBlur,
  onChange,
  placeholder,
  helperText,
  type = 'text',
}: ArchiveInputProps) => {
  return (
    <FormControl className='archive-form-control'>
      <OutlinedInput
        className='archive-form-input'
        id={`archive-form-${id}`}
        placeholder={placeholder}
        name={id}
        type={type}
        onChange={event => (onChange ? onChange(event) : {})}
        inputProps={{
          onBlur: event => (onBlur ? onBlur(event) : {}),
        }}
        value={value}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ArchiveInput;
