import React, { useCallback, useContext, useMemo } from 'react';
import './TagOverview.scss';
import {
  ComponentCommonSynonyms,
  ComponentCommonSynonymsInput,
  useGetAllKeywordTagsQuery,
  useUpdateKeywordNameMutation,
  useUpdateKeywordSynonymsMutation,
} from '../../graphql/APIConnector';
import QueryErrorDisplay from '../shared/QueryErrorDisplay';
import Loading from '../shared/Loading';
import { FlatKeywordTag } from '../../graphql/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
  GridRowsProp,
} from '@mui/x-data-grid';
import { AlertContext, AlertType } from '../shared/AlertWrapper';
import { Chip } from '@mui/material';

interface TagRow {
  id: string;
  name: string;
  synonyms: { synonyms: ComponentCommonSynonyms[]; tagId: string };
  add: string;
}

const TagOverview = () => {
  const openAlert = useContext(AlertContext);

  const { data, loading, error, refetch } = useGetAllKeywordTagsQuery();
  const flattenedKeywordtags: FlatKeywordTag[] | undefined =
    useSimplifiedQueryResponseData(data)?.keywordTags;

  // Store keywordTags in object
  const keywordTags: { [key: string]: FlatKeywordTag } = useMemo(() => {
    const tags: { [key: string]: FlatKeywordTag } = {};
    flattenedKeywordtags?.forEach(tag => {
      tags[tag.id] = tag;
    });
    return tags;
  }, [flattenedKeywordtags]);

  const [updateSynonymsMutation] = useUpdateKeywordSynonymsMutation({
    onCompleted: _ => {
      refetch();
    },
    onError: error => {
      openAlert({
        alertType: AlertType.ERROR,
        message: error.message,
      });
    },
  });

  const [updateNameMutation] = useUpdateKeywordNameMutation({
    onCompleted: _ => {
      refetch();
    },
    onError: error => {
      openAlert({
        alertType: AlertType.ERROR,
        message: error.message,
      });
    },
  });

  const addSynonym = useCallback(
    (tagId: string, synonymName: string) => {
      const synonyms: ComponentCommonSynonymsInput[] =
        keywordTags[tagId].synonyms?.map(s => ({ name: s?.name })) ?? [];
      synonyms.push({ name: synonymName });
      updateSynonymsMutation({
        variables: {
          tagId,
          synonyms,
        },
      });
    },
    [updateSynonymsMutation, keywordTags]
  );

  const deleteSynonym = useCallback(
    (tagId: string, synonymName: string) => {
      updateSynonymsMutation({
        variables: {
          tagId,
          synonyms:
            keywordTags[tagId].synonyms?.filter(s => s?.name !== '' && s?.name !== synonymName) ??
            [],
        },
      });
    },
    [updateSynonymsMutation, keywordTags]
  );

  const processRowUpdate = useCallback(
    (row: GridRowModel<TagRow>) => {
      if (row.add !== '') {
        if (!keywordTags[row.id].synonyms?.some(s => s?.name === row.add)) {
          addSynonym(row.id, row.add);
        } else {
          openAlert({ alertType: AlertType.ERROR, message: 'Dieses Synonym existiert schon' });
        }
        row.add = '';
      } else if (row.name !== keywordTags[row.id].name) {
        updateNameMutation({ variables: { tagId: row.id, name: row.name } });
      }
      return row;
    },
    [addSynonym, keywordTags, openAlert, updateNameMutation]
  );

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    {
      field: 'synonyms',
      headerName: 'Synonyme',
      flex: 3,
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
      headerName: 'Hinzufügen',
      flex: 1,
      editable: true,
    },
  ];

  const rows: GridRowsProp = Object.values(keywordTags).map(keywordTag => {
    return {
      id: keywordTag.id,
      name: keywordTag.name,
      synonyms: { synonyms: keywordTag.synonyms, tagId: keywordTag.id },
      add: '',
    } as TagRow;
  });

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (Object.values(keywordTags).length) {
    return (
      <div className='grid'>
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
        />
      </div>
    );
  } else {
    return null;
  }
};

export default TagOverview;
