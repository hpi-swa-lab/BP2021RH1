import React, { useEffect, useState } from 'react';
import ArchiveInput from './ArchiveInput';

interface ArchiveInputFieldProps {
  defaultValue: string;
  id: string;
  onBlur: (value: string, status?: string) => void;
  onChange?: (value: string, status?: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
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
  helperText,
  regEx,
  type = 'text',
}: ArchiveInputFieldProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className='archive-form-div'>
      {label && (
        <label className='archive-form-label' htmlFor={`archive-form-${id}`}>
          {label}
        </label>
      )}
      <ArchiveInput
        id={id}
        placeholder={placeholder}
        type={type}
        onChange={event => setValue(event.target.value)}
        onBlur={() => onBlur(value)}
        value={value}
        helperText={helperText}
      />
    </div>
  );
};

export default ArchiveInputField;
