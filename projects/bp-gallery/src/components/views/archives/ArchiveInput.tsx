import { FormControl, FormHelperText, OutlinedInput } from '@mui/material';

interface ArchiveInputProps {
  value: string;
  id: string;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  placeholder?: string;
  helperText?: string;
  type?: string;
  error?: boolean;
}

const ArchiveInput = ({
  value,
  id,
  onBlur,
  onChange,
  placeholder,
  helperText,
  type = 'text',
  error,
}: ArchiveInputProps) => {
  return (
    <FormControl className='archive-form-control'>
      <OutlinedInput
        className='archive-form-input'
        id={`archive-form-${id}`}
        placeholder={placeholder}
        name={id}
        type={type}
        error={error}
        onChange={event => (onChange ? onChange(event) : {})}
        inputProps={{
          onBlur: event => (onBlur ? onBlur(event) : {}),
        }}
        value={value}
      />
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ArchiveInput;
