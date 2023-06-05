import { Close, Done } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { HTMLAttributes, ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogProps } from '../DialogProvider';
import './SelectDialogPreset.scss';

const SelectDialogPreset = ({
  handleClose,
  dialogProps,
  allOptions,
  inputLabel,
  renderOption,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
  allOptions: any[];
  inputLabel: string;
  renderOption?: (props: HTMLAttributes<HTMLLIElement>, option: any, highlight?: any) => ReactNode;
}) => {
  const { t } = useTranslation();

  const [highlight, setHighlight] = useState<any>();
  const selectedOption = useRef<any | undefined>(undefined);

  return (
    <>
      <DialogTitle>{dialogProps.title ?? t('curator.selectOption')}</DialogTitle>
      <DialogContent>
        {dialogProps.content}
        <Autocomplete
          disablePortal
          options={allOptions}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => <TextField {...params} label={inputLabel} />}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {renderOption ? renderOption(props, option, highlight) : option.name}
              </li>
            );
          }}
          getOptionLabel={(option: any) => option.name}
          onChange={(_, value: any | null) => {
            selectedOption.current = value ?? undefined;
          }}
          onHighlightChange={(event, option, reason) => {
            setHighlight(option);
          }}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleClose(undefined)} startIcon={<Close />}>
          {t('common.abort')}
        </Button>
        <Button
          onClick={() => handleClose(selectedOption.current ?? undefined)}
          startIcon={<Done />}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </>
  );
};

export default SelectDialogPreset;
