import { Icon, Tooltip } from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import { DialogContext, DialogPreset } from '../../provider/DialogProvider';
import { useUpdateCollectionMutation } from '../../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';

const UnlinkCollectionAction = ({
  childCollection,
  parentCollection,
}: {
  childCollection: FlatCollection;
  parentCollection: FlatCollection;
}) => {
  const { t } = useTranslation();
  const dialog = useContext(DialogContext);
  const [updateCollection] = useUpdateCollectionMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
  });

  const onUnlinkChildCollection = useCallback(
    (collection: FlatCollection) => {
      dialog({
        preset: DialogPreset.CONFIRM,
        title: t('curator.reallyUnlink'),
        content: t('curator.unlinkFromCollection', {
          parent: parentCollection.name,
        }),
      }).then(resp => {
        if (!resp) {
          return;
        }
        const newParents = (collection.parent_collections?.map(p => p.id) ?? []).filter(
          id => id !== parentCollection.id
        );
        updateCollection({
          variables: {
            collectionId: collection.id,
            data: {
              parent_collections: newParents,
            },
          },
        });
      });
    },
    [parentCollection, dialog, t, updateCollection]
  );

  return (
    <Tooltip
      title={
        t('curator.collectionParents', {
          parents:
            (childCollection.parent_collections as FlatCollection[] | undefined)
              ?.map(c => ` - ${c.name}`)
              .join('\n') ?? '',
        }) ?? ''
      }
    >
      <span
        className='link-indicator'
        onClick={event => {
          event.stopPropagation();
          onUnlinkChildCollection(childCollection);
        }}
      >
        <Icon>link</Icon>
        <span>{childCollection.parent_collections?.length}</span>
      </span>
    </Tooltip>
  );
};

export default UnlinkCollectionAction;
