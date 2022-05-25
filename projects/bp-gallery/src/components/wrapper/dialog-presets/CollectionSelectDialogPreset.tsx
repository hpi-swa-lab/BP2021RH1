import React, { useRef } from 'react';
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Close, Done } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetAllCollectionsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import './CollectionSelectDialogPreset.scss';
import { DialogProps } from '../DialogWrapper';

const CollectionSelectDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { data } = useGetAllCollectionsQuery();

  const { t } = useTranslation();

  const selectedCollection = useRef<FlatCollection | undefined>(undefined);

  const allCollections: FlatCollection[] | undefined =
    useSimplifiedQueryResponseData(data)?.collections;

  return (
    <>
      <DialogTitle>{dialogProps.title ?? t('curator.selectTargetCollection')}</DialogTitle>
      <DialogContent>
        {dialogProps.content}
        <Autocomplete
          disablePortal
          options={allCollections ?? []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => <TextField {...params} label={t('common.collection')} />}
          getOptionLabel={(option: FlatCollection) => option.name}
          onChange={(_, value: FlatCollection | null) => {
            selectedCollection.current = value ?? undefined;
          }}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleClose(undefined)} startIcon={<Close />}>
          {t('common.abort')}
        </Button>
        <Button
          onClick={() => handleClose(selectedCollection.current ?? undefined)}
          startIcon={<Done />}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </>
  );
};

export default CollectionSelectDialogPreset;
