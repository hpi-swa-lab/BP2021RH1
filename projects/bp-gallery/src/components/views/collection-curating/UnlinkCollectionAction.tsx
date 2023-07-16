import { Link } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunUpdateCollectionParentsMutation,
  useUpdateCollectionParentsMutation,
} from '../../../graphql/APIConnector';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';

const UnlinkCollectionAction = ({
  childCollection,
  parentCollection,
}: {
  childCollection: FlatCollection;
  parentCollection: FlatCollection;
}) => {
  const { t } = useTranslation();
  const dialog = useDialog();
  const [updateCollectionParents] = useUpdateCollectionParentsMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
  });
  const { canRun: canUpdateCollectionParents } = useCanRunUpdateCollectionParentsMutation();

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
        updateCollectionParents({
          variables: {
            collectionId: collection.id,
            parentCollectionIds: newParents,
          },
        });
      });
    },
    [parentCollection, dialog, t, updateCollectionParents]
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
        onClick={
          canUpdateCollectionParents
            ? event => {
                event.stopPropagation();
                onUnlinkChildCollection(childCollection);
              }
            : undefined
        }
      >
        <Link />
        <span>{childCollection.parent_collections?.length}</span>
      </span>
    </Tooltip>
  );
};

export default UnlinkCollectionAction;
