import { Delete, Edit } from '@mui/icons-material';
import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { cloneDeep } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useDeleteCollectionMutation,
  useGetChildCollectionsQuery,
  useGetRootCollectionQuery,
  useUpdateCollectionMutation,
} from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { FlatCollection } from '../../types/additionalFlatTypes';
import './CollectionsOverview.scss';
import { DialogContext } from '../shared/DialogWrapper';

const CollectionsOverview = () => {
  const [panels, setPanels] = useState<string[]>([]);

  const { data: rootCollection } = useGetRootCollectionQuery();

  useEffect(() => {
    const id = rootCollection?.browseRootCollection?.data?.id;
    if (id) {
      setPanels([id]);
    }
  }, [rootCollection]);

  return (
    <div className='panel-container'>
      {Object.values(panels).map((collectionId, index) => (
        <CollectionsPanel
          key={collectionId}
          parentId={collectionId}
          onSelectChild={child => {
            setPanels(oldPanels => {
              if (index + 1 >= oldPanels.length) {
                oldPanels.push(child.id);
              } else {
                oldPanels[index + 1] = child.id;
              }
              oldPanels = oldPanels.slice(0, index + 2);
              return cloneDeep(oldPanels);
            });
          }}
        />
      ))}
    </div>
  );
};

const CollectionsPanel = ({
  parentId,
  onSelectChild,
}: {
  parentId: string;
  onSelectChild: (child: FlatCollection) => void;
}) => {
  const { t } = useTranslation();
  const dialog = useContext(DialogContext);

  const { data } = useGetChildCollectionsQuery({
    variables: {
      collectionId: parentId,
    },
  });
  const [updateCollection] = useUpdateCollectionMutation({
    refetchQueries: ['getChildCollections'],
  });
  const [deleteCollection] = useDeleteCollectionMutation({
    refetchQueries: ['getChildCollections'],
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const parentCollection: FlatCollection | undefined =
    useSimplifiedQueryResponseData(data)?.collection;

  const children: FlatCollection[] | undefined = parentCollection?.child_collections;

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
      console.log(collection);
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

  return (
    <div className='panel'>
      <div className='panel-header'>
        <span className='text'>{parentCollection?.name ?? ''}</span>
      </div>
      <div className='panel-content'>
        {children?.map(child => {
          return (
            <div className='panel-entry' key={child.id} onClick={() => onSelectChild(child)}>
              <span className='text'>{child.name}</span>
              <span className='actions'>
                <IconButton onClick={() => onDelete(child)}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => onEditName(child)}>
                  <Edit />
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
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem>
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText>{t('curator.createCollection')}</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Icon>link</Icon>
            </ListItemIcon>
            <ListItemText>{t('curator.linkCollection')}</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Icon>move_down</Icon>
            </ListItemIcon>
            <ListItemText>{t('curator.moveCollection')}</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default CollectionsOverview;
