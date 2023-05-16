import { useEffect, useState } from 'react';
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
  errorFn?: (value: string) => Promise<boolean>;
  errorText?: string;
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
  errorFn,
  errorText,
}: ArchiveInputFieldProps) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const fetchError = async (value: string) => {
      if (!errorFn) return false;
      const isError = await errorFn(value);
      setError(isError);
    };
    fetchError(value).catch();
  });
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
        helperText={error && errorText ? errorText : helperText}
        error={error}
      />
    </div>
  );
};

export default ArchiveInputField;
