import React, { useCallback, useContext, useMemo, useState } from 'react';
import './TagOverview.scss';
import { ComponentCommonSynonyms, ComponentCommonSynonymsInput } from '../../graphql/APIConnector';
import QueryErrorDisplay from '../shared/QueryErrorDisplay';
import Loading from '../shared/Loading';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
  GridRowsProp,
} from '@mui/x-data-grid';
import { AlertContext, AlertType } from '../shared/AlertWrapper';
import { Button, Chip, IconButton } from '@mui/material';
import useGenericTagEndpoints from './endpoints';
import { useTranslation } from 'react-i18next';
import { Delete } from '@mui/icons-material';
import { DialogContext, DialogPreset } from '../shared/DialogWrapper';

interface TagRow {
  id: string;
  name: string;
  synonyms: { synonyms: ComponentCommonSynonyms[]; tagId: string };
  add: string;
  delete: { tagId: string };
}

interface FlatTag {
  id: string;
  name: string;
  synonyms?: (ComponentCommonSynonyms | undefined)[];
}

const TagOverview = ({ type }: { type: string }) => {
  const openAlert = useContext(AlertContext);
  const prompt = useContext(DialogContext);
  const { t } = useTranslation();
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const {
    allTagsQuery,
    updateTagNameMutationSource,
    updateSynonymsMutationSource,
    mergeTagsMutationSource,
    deleteTagMutationSource,
  } = useGenericTagEndpoints(type);

  const { data, loading, error, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  // Store tags in object
  const tags: { [key: string]: FlatTag } = useMemo(() => {
    const tags: { [key: string]: FlatTag } = {};
    flattenedTags?.forEach(tag => {
      tags[tag.id] = tag;
    });
    return tags;
  }, [flattenedTags]);

  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    errorPolicy: 'all',
    onCompleted: _ => {
      refetch();
    },
  });

  const [updateTagNameMutation] = updateTagNameMutationSource({
    errorPolicy: 'all',
    onCompleted: _ => {
      refetch();
    },
  });

  const [mergeTagsMutation] = mergeTagsMutationSource({
    errorPolicy: 'all',
    onCompleted: _ => {
      refetch();
    },
  });

  const [deleteTagMutation] = deleteTagMutationSource({
    errorPolicy: 'all',
    onCompleted: _ => {
      refetch();
    },
  });

  const addSynonym = useCallback(
    (tagId: string, synonymName: string) => {
      const synonyms: ComponentCommonSynonymsInput[] =
        tags[tagId].synonyms?.map(s => ({ name: s?.name })) ?? [];
      synonyms.push({ name: synonymName });
      updateSynonymsMutation({
        variables: {
          tagId,
          synonyms,
        },
      });
    },
    [updateSynonymsMutation, tags]
  );

  const deleteSynonym: (tagId: string, synonymName: string) => void = useCallback(
    (tagId: string, synonymName: string) => {
      updateSynonymsMutation({
        variables: {
          tagId,
          synonyms:
            tags[tagId].synonyms?.filter(s => s?.name !== '' && s?.name !== synonymName) ??
            ([] as any),
        },
      });
    },
    [updateSynonymsMutation, tags]
  );

  const deleteTag = useCallback(
    async (tagId?: string, tagName?: string) => {
      if (!tagId || !tagName) return;
      const reallyDelete = await prompt({
        preset: DialogPreset.CONFIRM,
        title: t('curator.reallyDeleteTag'),
        content: tagName,
      });
      if (reallyDelete) {
        deleteTagMutation({
          variables: {
            id: tagId,
          },
        });
      }
    },
    [deleteTagMutation, prompt, t]
  );

  const processRowUpdate = useCallback(
    (row: GridRowModel<TagRow>) => {
      if (row.add !== '') {
        if (!tags[row.id].synonyms?.some(s => s?.name === row.add)) {
          addSynonym(row.id, row.add);
        } else {
          openAlert({ alertType: AlertType.ERROR, message: t('curator.synonymAlreadyExists') });
        }
        row.add = '';
      } else if (row.name !== tags[row.id].name) {
        updateTagNameMutation({ variables: { tagId: row.id, name: row.name } });
      }
      return row;
    },
    [addSynonym, tags, openAlert, updateTagNameMutation, t]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 2, editable: true },
      {
        field: 'synonyms',
        headerName: t('curator.synonyms'),
        flex: 6,
        renderCell: (
          params: GridRenderCellParams<{
            synonyms: ComponentCommonSynonyms[];
            tagId: string;
          }>
        ) => {
          return params.value?.synonyms.map((s: ComponentCommonSynonyms) => (
            <Chip
              key={s.name}
              label={s.name}
              onDelete={params.value ? () => deleteSynonym(params.value!.tagId, s.name) : undefined}
            />
          ));
        },
      },
      {
        field: 'add',
        headerName: t('curator.add'),
        flex: 2,
        editable: true,
      },
      {
        field: 'delete',
        headerName: t('common.delete'),
        flex: 1,
        renderCell: (
          params: GridRenderCellParams<{
            tagId: string;
            tagName: string;
          }>
        ) => {
          return (
            <IconButton
              onClick={() => {
                deleteTag(params.value?.tagId, params.value?.tagName);
              }}
            >
              <Delete />
            </IconButton>
          );
        },
      },
    ],
    [deleteTag, t, deleteSynonym]
  );

  const rows: GridRowsProp = useMemo(
    () =>
      Object.values(tags).map(tag => {
        return {
          id: tag.id,
          name: tag.name,
          synonyms: { synonyms: tag.synonyms, tagId: tag.id },
          add: '',
          delete: { tagId: tag.id, tagName: tag.name },
        } as TagRow;
      }),
    [tags]
  );

  const getSelectedRows = useCallback(
    (selectedIds: string[]) => {
      const ids = new Set(selectedIds);
      return rows.filter(row => ids.has(row.id));
    },
    [rows]
  );

  const mergeTags = useCallback(() => {
    if (selectedRowIds.length !== 2) {
      openAlert({
        alertType: AlertType.ERROR,
        message: t('curator.mergeLimit'),
      });
    } else {
      const selectedRows: GridRowsProp = getSelectedRows(selectedRowIds);
      mergeTagsMutation({
        variables: {
          targetId: selectedRows[0].id as string,
          sourceId: selectedRows[1].id as string,
        },
      });
    }
  }, [openAlert, mergeTagsMutation, selectedRowIds, getSelectedRows, t]);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (Object.values(tags).length) {
    return (
      <div className='grid'>
        <Button onClick={mergeTags}>merge</Button>
        <DataGrid
          rows={rows}
          columns={columns}
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={error => {
            openAlert({
              alertType: AlertType.ERROR,
              message: error.message,
            });
          }}
          checkboxSelection={true}
          selectionModel={selectedRowIds}
          onSelectionModelChange={newSelectionModel => {
            setSelectedRowIds(newSelectionModel as string[]);
          }}
          disableSelectionOnClick={true}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default TagOverview;
