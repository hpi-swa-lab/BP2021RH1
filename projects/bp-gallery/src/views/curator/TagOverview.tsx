import React, { useCallback, useContext, useMemo } from 'react';
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
import { Chip } from '@mui/material';
import useGenericTagEndpoints from './endpoints';
import { useTranslation } from 'react-i18next';

interface TagRow {
  id: string;
  name: string;
  synonyms: { synonyms: ComponentCommonSynonyms[]; tagId: string };
  add: string;
}

interface FlatTag {
  id: string;
  name: string;
  synonyms?: (ComponentCommonSynonyms | undefined)[];
}

const TagOverview = ({ type }: { type: string }) => {
  const openAlert = useContext(AlertContext);
  const { t } = useTranslation();

  const { tagQuery, updateTagNameMutationSource, updateSynonymsMutationSource } =
    useGenericTagEndpoints(type);
  const { data, loading, error, refetch } = tagQuery();
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
    onError: error => {
      openAlert({
        alertType: AlertType.ERROR,
        message: error.message,
      });
    },
  });

  const [updateTagNameMutation] = updateTagNameMutationSource({
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
      { field: 'name', headerName: 'Name', flex: 1, editable: true },
      {
        field: 'synonyms',
        headerName: t('curator.synonyms'),
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
        headerName: t('curator.add'),
        flex: 1,
        editable: true,
      },
    ],
    [t, deleteSynonym]
  );

  const rows: GridRowsProp = useMemo(
    () =>
      Object.values(tags).map(tag => {
        return {
          id: tag.id,
          name: tag.name,
          synonyms: { synonyms: tag.synonyms, tagId: tag.id },
          add: '',
        } as TagRow;
      }),
    [tags]
  );

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (Object.values(tags).length) {
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
