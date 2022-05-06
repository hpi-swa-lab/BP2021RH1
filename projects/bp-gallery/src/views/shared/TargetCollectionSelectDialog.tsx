import React, { useRef } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Close, Done } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetAllCollectionsQuery } from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { FlatCollection } from '../../types/additionalFlatTypes';
import './TargetCollectionSelectDialog.scss';

const TargetCollectionSelectDialog = ({
  selectCallback,
  disableCollectionIds,
  title,
}: {
  selectCallback?: (selectedCollection: FlatCollection | undefined) => void;
  disableCollectionIds?: string[];
  title?: string;
}) => {
  const { data } = useGetAllCollectionsQuery();

  const { t } = useTranslation();

  const selectedCollection = useRef<FlatCollection | undefined>(undefined);

  const allCollections: FlatCollection[] | undefined =
    useSimplifiedQueryResponseData(data)?.collections;

  return (
    <Dialog open={Boolean(selectCallback)} onClose={() => selectCallback?.(undefined)}>
      <DialogTitle>{title ?? t('curator.selectTargetCollection')}</DialogTitle>
      <DialogContent>
        <Autocomplete
          disablePortal
          options={
            allCollections?.filter(
              c => !disableCollectionIds || !disableCollectionIds.includes(c.id)
            ) ?? []
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => <TextField {...params} label={t('common.collection')} />}
          getOptionLabel={(option: FlatCollection) => option.name}
          onChange={(_, value: FlatCollection | null) => {
            selectedCollection.current = value ?? undefined;
          }}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => selectCallback?.(undefined)} startIcon={<Close />}>
          {t('common.abort')}
        </Button>
        <Button
          onClick={() => selectCallback?.(selectedCollection.current ?? undefined)}
          startIcon={<Done />}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TargetCollectionSelectDialog;
