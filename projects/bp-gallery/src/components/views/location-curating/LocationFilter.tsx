import { Close } from '@mui/icons-material';
import { Autocomplete, MenuItem, Select, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';

export enum LocationFilterType {
  CONTAINS = 'contains',
  EQUALS = 'equals',
  STARTS_WITH = 'starts with',
  ENDS_WITH = 'ends with',
  IS_EMPTY = 'is empty',
  IS_NOT_EMPTY = 'is not empty',
  IS_ANY_OF = 'is any of',
}

const LocationFilter = ({
  filterType,
  filterValue,
  setFilterType,
  setFilterValue,
  setOpen,
}: {
  filterType: LocationFilterType;
  filterValue?: string | string[];
  setFilterType: (value: LocationFilterType) => void;
  setFilterValue: (value: string | string[] | undefined) => void;
  setOpen: (value: boolean) => void;
}) => {
  const showTextField = () =>
    filterType !== LocationFilterType.IS_EMPTY &&
    filterType !== LocationFilterType.IS_NOT_EMPTY &&
    filterType !== LocationFilterType.IS_ANY_OF;

  const showAutocomplete = () => filterType === LocationFilterType.IS_ANY_OF;

  const [localFilterValue, setLocalFilterValue] = useState<string | string[]>(
    filterValue ?? (filterType === LocationFilterType.IS_ANY_OF ? [] : '')
  );
  const localFilterRef = useRef<string | string[] | undefined>(
    filterValue ?? (filterType === LocationFilterType.IS_ANY_OF ? [] : '')
  );

  const updateFilterValue = debounce(() => {
    setFilterValue(localFilterRef.current);
  }, 1000);

  return (
    <div className='p-2 fixed top-30 left-0 z-20 bg-white shadow-lg flex rounded-[5px]'>
      <Close
        className='my-auto mr-2 cursor-pointer'
        onClick={() => {
          if (localFilterValue) {
            localFilterRef.current = '';
            setLocalFilterValue('');
            updateFilterValue();
            return;
          }
          setOpen(false);
        }}
      />
      <Select
        value={filterType}
        onChange={value => {
          setLocalFilterValue(
            (value.target.value as LocationFilterType) === LocationFilterType.IS_ANY_OF ? [] : ''
          );
          localFilterRef.current =
            (value.target.value as LocationFilterType) === LocationFilterType.IS_ANY_OF ? [] : '';
          updateFilterValue();
          setFilterType(value.target.value as LocationFilterType);
        }}
        className='mr-1'
      >
        <MenuItem value={LocationFilterType.CONTAINS}>{LocationFilterType.CONTAINS}</MenuItem>
        <MenuItem value={LocationFilterType.EQUALS}>{LocationFilterType.EQUALS}</MenuItem>
        <MenuItem value={LocationFilterType.STARTS_WITH}>{LocationFilterType.STARTS_WITH}</MenuItem>
        <MenuItem value={LocationFilterType.ENDS_WITH}>{LocationFilterType.ENDS_WITH}</MenuItem>
        <MenuItem value={LocationFilterType.IS_EMPTY}>{LocationFilterType.IS_EMPTY}</MenuItem>
        <MenuItem value={LocationFilterType.IS_NOT_EMPTY}>
          {LocationFilterType.IS_NOT_EMPTY}
        </MenuItem>
        <MenuItem value={LocationFilterType.IS_ANY_OF}>{LocationFilterType.IS_ANY_OF}</MenuItem>
      </Select>
      {showTextField() && (
        <TextField
          value={localFilterValue}
          onChange={value => {
            localFilterRef.current = value.target.value;
            setLocalFilterValue(value.target.value);
            updateFilterValue();
          }}
        />
      )}
      {showAutocomplete() && (
        <Autocomplete
          value={filterValue && Array.isArray(filterValue) ? filterValue : []}
          options={[]}
          multiple
          freeSolo
          renderInput={props => <TextField {...props} />}
          onChange={(_, values) => {
            localFilterRef.current = values;
            setLocalFilterValue(values);
            updateFilterValue();
          }}
        />
      )}
    </div>
  );
};

export default LocationFilter;
