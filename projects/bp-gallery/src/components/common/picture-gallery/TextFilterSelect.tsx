import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextFilter } from '../../../hooks/get-pictures.hook';

export const TextFilterSelect = ({
  value,
  onChange,
}: {
  value: TextFilter[];
  onChange: (newTextFilter: TextFilter[]) => void;
}) => {
  const { t } = useTranslation();

  const onSelectChange = useCallback(
    (event: SelectChangeEvent<TextFilter[]>) => {
      const textFilters = event.target.value;
      if (
        Array.isArray(textFilters) &&
        !textFilters.some(filter => filter in TextFilter === false)
      ) {
        onChange(textFilters);
      }
    },
    [onChange]
  );

  return (
    <Select<TextFilter[]> value={value} onChange={onSelectChange} variant='standard' multiple>
      <MenuItem value={TextFilter.INCLUDE_PICTURES}>{t('common.textFilter.onlyPictures')}</MenuItem>
      <MenuItem value={TextFilter.INCLUDE_PDFS}>{t('common.textFilter.onlyPdfs')}</MenuItem>
      <MenuItem value={TextFilter.INCLUDE_TEXTS}>{t('common.textFilter.onlyTexts')}</MenuItem>
    </Select>
  );
};
