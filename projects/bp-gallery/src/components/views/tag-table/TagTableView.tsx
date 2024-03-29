import { Delete } from '@mui/icons-material';
import { Button, Chip, IconButton } from '@mui/material';
import {
  DataGrid,
  GridCheckIcon,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
  GridRowsProp,
} from '@mui/x-data-grid';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ComponentCommonSynonyms,
  ComponentCommonSynonymsInput,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import ProtectedRoute from '../../common/ProtectedRoute';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import { AlertContext, AlertType } from '../../provider/AlertProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import './TagTableView.scss';

interface TagRow {
  id: string;
  name: string;
  synonyms: { synonyms: ComponentCommonSynonyms[]; tagId: string };
  add: string;
  delete: { tagId: string };
}

const TagTableView = ({ type }: { type: TagType }) => {
  const openAlert = useContext(AlertContext);
  const prompt = useDialog();
  const { t } = useTranslation();
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const {
    allTagsQuery,
    updateTagNameMutationSource,
    updateSynonymsMutationSource,
    mergeTagsMutationSource,
    deleteTagMutationSource,
    updateVisibilityMutationSource,
    canUseTagTableViewQuery,
    canUpdateTagNameQuery,
    canUpdateSynonymsQuery,
    canMergeTagsQuery,
    canDeleteTagQuery,
    canUpdateVisibilityQuery,
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
    onCompleted: _ => {
      refetch();
    },
  });
  const { canRun: canUpdateSynonyms } = canUpdateSynonymsQuery();

  const [updateTagNameMutation] = updateTagNameMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });
  const { canRun: canUpdateTagName } = canUpdateTagNameQuery();

  const [mergeTagsMutation] = mergeTagsMutationSource({
    onCompleted: _ => {
      setSelectedRowIds([]);
      refetch();
    },
  });
  const { canRun: canMergeTags } = canMergeTagsQuery();

  const [deleteTagMutation] = deleteTagMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });
  const { canRun: canDeleteTag } = canDeleteTagQuery();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [updateVisibilityMutation] = updateVisibilityMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const { canRun: canUpdateVisibility } = canUpdateVisibilityQuery();

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

  const additionalColumns = useMemo(() => {
    return type === TagType.LOCATION || type === TagType.KEYWORD
      ? [
          {
            field: 'visible',
            headerName: t('curator.visibility'),
            flex: 1,
            renderCell: (
              params: GridRenderCellParams<{
                visible: boolean;
              }>
            ) => {
              return params.value?.visible ? <GridCheckIcon /> : <></>;
            },
          },
        ]
      : [];
  }, [t, type]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 2, editable: canUpdateTagName },
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
              onDelete={
                canUpdateSynonyms && params.value
                  ? () => deleteSynonym(params.value!.tagId, s.name)
                  : undefined
              }
            />
          ));
        },
      },
      ...(canUpdateSynonyms
        ? [
            {
              field: 'add',
              headerName: t('curator.add'),
              flex: 2,
              editable: true,
            },
          ]
        : []),
      ...additionalColumns,
      ...(canDeleteTag
        ? [
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
          ]
        : []),
    ],
    [
      canUpdateTagName,
      t,
      canUpdateSynonyms,
      deleteSynonym,
      additionalColumns,
      canDeleteTag,
      deleteTag,
    ]
  );

  const rows: GridRowsProp = useMemo(
    () =>
      Object.values(tags).map(tag => {
        return {
          id: tag.id,
          name: tag.name,
          synonyms: { synonyms: tag.synonyms, tagId: tag.id },
          add: '',
          visible: { visible: tag.visible },
          delete: { tagId: tag.id, tagName: tag.name },
        } as TagRow;
      }),
    [tags]
  );

  const getSelectedRows = useCallback(
    (selectedIds: string[]) => {
      const ids = new Set(selectedIds);
      return rows.filter(row => ids.has(row.id as string));
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

  const setVisible = useCallback(
    (visible: boolean) => {
      const selectedRows: GridRowsProp = getSelectedRows(selectedRowIds);
      selectedRows.forEach(selectedRow => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        updateVisibilityMutation({
          variables: {
            tagId: selectedRow.id as string,
            visible: visible,
          },
        });
      });
    },
    [selectedRowIds, getSelectedRows, updateVisibilityMutation]
  );

  const { canRun: canUseTagTableView, loading: canUseTagTableViewLoading } =
    canUseTagTableViewQuery();

  return (
    <ProtectedRoute canUse={canUseTagTableView} canUseLoading={canUseTagTableViewLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (Object.values(tags).length) {
          return (
            <div className='tag-grid'>
              {canMergeTags && (
                <Button onClick={mergeTags} className='merge-button'>
                  {t('curator.mergeTag')}
                </Button>
              )}
              {canUpdateVisibility && (type === TagType.LOCATION || type === TagType.KEYWORD) && (
                <>
                  <Button onClick={() => setVisible(true)} className='merge-button'>
                    {t(`curator.show${type === TagType.LOCATION ? 'Location' : 'Keyword'}`)}
                  </Button>
                  <Button onClick={() => setVisible(false)} className='merge-button'>
                    {t(`curator.hide${type === TagType.LOCATION ? 'Location' : 'Keyword'}`)}
                  </Button>
                </>
              )}

              <DataGrid
                className='table'
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
      }}
    </ProtectedRoute>
  );
};

export default TagTableView;
