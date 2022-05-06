import { FlatCollection } from '../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useContext, useState } from 'react';
import { DialogContext, DialogPreset } from '../shared/DialogWrapper';
import { AlertContext, AlertType } from '../shared/AlertWrapper';
import {
  useDeleteCollectionMutation,
  useGetCollectionInfoByIdQuery,
  useMergeCollectionsMutation,
  useUpdateCollectionMutation,
} from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { Icon, IconButton } from '@mui/material';
import { Delete, Edit, MergeType } from '@mui/icons-material';
import AddCollectionMenu from './AddCollectionMenu';
import UnlinkCollectionAction from './UnlinkCollectionAction';

const CollectionsPanel = ({
  parentId,
  onSelectChild,
}: {
  parentId: string;
  onSelectChild: (child: FlatCollection) => void;
}) => {
  const { t } = useTranslation();
  const dialog = useContext(DialogContext);
  const openAlert = useContext(AlertContext);

  const [selectedChild, setSelectedChild] = useState<string | undefined>(undefined);

  const { data } = useGetCollectionInfoByIdQuery({
    variables: {
      collectionId: parentId,
    },
    fetchPolicy: 'cache-and-network',
  });
  const [updateCollection] = useUpdateCollectionMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
    errorPolicy: 'all',
  });
  const [deleteCollection] = useDeleteCollectionMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
    errorPolicy: 'all',
  });
  const [mergeCollections] = useMergeCollectionsMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
    errorPolicy: 'all',
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const parentCollection: FlatCollection | undefined =
    useSimplifiedQueryResponseData(data)?.collection;

  const children: FlatCollection[] | undefined = parentCollection?.child_collections;

  const selectChild = useCallback(
    (child: FlatCollection) => {
      onSelectChild(child);
      setSelectedChild(child.id);
    },
    [onSelectChild, setSelectedChild]
  );

  const onEditName = useCallback(
    (collection: FlatCollection) => {
      // TODO: This needs to be changed, not a permanent solution!
      // eslint-disable-next-line no-alert
      const collectionName = prompt('Neuer Name der Collection:', collection.name);
      if (collectionName?.length) {
        updateCollection({
          variables: { collectionId: collection.id, data: { name: collectionName } },
        }).catch(error => {
          dialog({
            options: [{ name: t('common.close'), value: true }],
            title: t('curator.saveStatus.error'),
            content: t('curator.renameCollectionFailed'),
          });
        });
      }
    },
    [updateCollection, t, dialog]
  );

  const onDelete = useCallback(
    (collection: FlatCollection) => {
      if (collection.child_collections?.length || collection.pictures?.length) {
        dialog({
          options: [{ name: t('common.close'), value: true }],
          title: t('curator.saveStatus.error'),
          content: t('curator.collectionNotEmpty'),
        });
      } else {
        deleteCollection({ variables: { collectionId: collection.id } });
      }
    },
    [deleteCollection, dialog, t]
  );

  const onMerge = useCallback(
    async (collection: FlatCollection) => {
      const targetCollection: FlatCollection | undefined = await dialog({
        preset: DialogPreset.SELECT_COLLECTION,
        title: t('curator.chooseSelectionToMerge', { name: collection.name }),
        content: '',
      });
      if (!targetCollection) return;
      if (targetCollection.id === collection.id) {
        openAlert({ alertType: AlertType.ERROR, message: t('curator.notMergeSameCollection') });
      } else {
        mergeCollections({
          variables: {
            targetId: targetCollection.id,
            sourceId: collection.id,
          },
        });
      }
    },
    [mergeCollections, dialog, openAlert, t]
  );

  return (
    <div className='panel'>
      <div className='panel-header'>
        <span className='text'>{parentCollection?.name ?? ''}</span>
      </div>
      <div className='panel-content'>
        {children?.map(child => {
          return (
            <div
              className={`panel-entry${selectedChild === child.id ? ' selected' : ''}`}
              key={child.id}
              onClick={() => selectChild(child)}
            >
              {(child.parent_collections?.length ?? 0) > 1 && parentCollection && (
                <UnlinkCollectionAction
                  childCollection={child}
                  parentCollection={parentCollection}
                />
              )}
              <span className='text'>{child.name}</span>
              <span className='actions'>
                <IconButton onClick={() => onDelete(child)}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => onEditName(child)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onMerge(child)}>
                  <MergeType />
                </IconButton>
              </span>
            </div>
          );
        })}
        <div
          className='panel-entry new'
          onClick={event => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <Icon>add</Icon>
          {t('curator.addCollection')}
        </div>
        <AddCollectionMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          parentCollectionId={parentId}
        />
      </div>
    </div>
  );
};

export default CollectionsPanel;
