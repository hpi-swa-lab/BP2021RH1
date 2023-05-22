import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const SeeUnpublishedCollectionsParameter = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (newValue: boolean) => void;
}) => {
  const { t } = useTranslation();

  const onSelectChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      if (typeof event.target.value === 'number') {
        onChange(Boolean(event.target.value));
      }
    },
    [onChange]
  );

  return (
    // MenuItems can only have strings or numbers as values,
    // so we use 0 as false and 1 as true. They are converted above.
    <Select value={Number(value)} onChange={onSelectChange} variant='standard'>
      <MenuItem value={0}>
        {t('admin.permissions.parameter.see_unpublished_collections.onlyPublished')}
      </MenuItem>
      <MenuItem value={1}>
        {t('admin.permissions.parameter.see_unpublished_collections.all')}
      </MenuItem>
    </Select>
  );
};
