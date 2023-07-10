import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextFilter } from '../../../hooks/get-pictures.hook';

export const TextFilterSelect = ({
  value,
  onChange,
}: {
  value: TextFilter;
  onChange: (newTextFilter: TextFilter) => void;
}) => {
  const { t } = useTranslation();

  const onSelectChange = useCallback(
    (event: SelectChangeEvent<TextFilter>) => {
      if (event.target.value in TextFilter) {
        onChange(event.target.value as TextFilter);
      }
    },
    [onChange]
  );

  return (
    <Select
      value={value}
      onChange={onSelectChange}
      variant='standard'
      data-testid='text-filter-select'
    >
      <MenuItem value={TextFilter.ONLY_PICTURES}>{t('common.textFilter.onlyPictures')}</MenuItem>
      <MenuItem value={TextFilter.PICTURES_AND_TEXTS}>
        {t('common.textFilter.picturesAndTexts')}
      </MenuItem>
      <MenuItem value={TextFilter.ONLY_TEXTS}>{t('common.textFilter.onlyTexts')}</MenuItem>
    </Select>
  );
};
