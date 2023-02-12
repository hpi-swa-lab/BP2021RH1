import { Icon, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useCallback } from 'react';
import { useDialog, DialogPreset } from '../../provider/DialogProvider';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import {
  useCreateSubCollectionMutation,
  useUpdateCollectionMutation,
} from '../../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';

const AddCollectionMenu = ({
  anchorEl,
  setAnchorEl,
  parentCollectionId,
}: {
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorElement: null | HTMLElement) => void;
  parentCollectionId: string;
}) => {
  const { t } = useTranslation();
  const dialog = useDialog();

  const open = Boolean(anchorEl);

  const [updateCollection] = useUpdateCollectionMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
  });
  const [createSubCollection] = useCreateSubCollectionMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
  });

  const onCreateSubCollection = useCallback(async () => {
    const collectionName = await dialog({
      preset: DialogPreset.INPUT_FIELD,
      title: t('curator.nameOfNewCollection'),
    });
    if (collectionName?.length) {
      createSubCollection({
        variables: {
          name: collectionName,
          parentId: parentCollectionId,
          publishedAt: new Date().toISOString(),
        },
      });
    }
  }, [createSubCollection, parentCollectionId, dialog, t]);

  const onLinkOrMoveSubcollection = useCallback(
    (moveCollection?: boolean) => {
      dialog({
        preset: DialogPreset.SELECT_COLLECTION,
        content: '',
      }).then(async (selectedCollection: FlatCollection | undefined) => {
        if (selectedCollection) {
          const originalParents = selectedCollection.parent_collections ?? [];
          if (moveCollection && originalParents.length > 1) {
            const reallyMove = await dialog({
              title: t('curator.moveFromAll'),
              content: t('curator.moveFromHere', {
                parents: originalParents.map(p => p.name).join(', '),
              }),
              preset: DialogPreset.CONFIRM,
            });
            if (!reallyMove) {
              return;
            }
          }
          const parents = moveCollection ? [] : originalParents.map(c => c.id);
          parents.push(parentCollectionId);
          updateCollection({
            variables: {
              collectionId: selectedCollection.id,
              data: {
                parent_collections: parents,
              },
            },
          });
        }
      });
    },
    [updateCollection, parentCollectionId, dialog, t]
  );

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
      <MenuItem onClick={() => onCreateSubCollection()}>
        <ListItemIcon>
          <Icon>add</Icon>
        </ListItemIcon>
        <ListItemText>{t('curator.createCollection')}</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onLinkOrMoveSubcollection(false)}>
        <ListItemIcon>
          <Icon>link</Icon>
        </ListItemIcon>
        <ListItemText>{t('curator.linkCollection')}</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onLinkOrMoveSubcollection(true)}>
        <ListItemIcon>
          <Icon>move_down</Icon>
        </ListItemIcon>
        <ListItemText>{t('curator.moveCollection')}</ListItemText>
      </MenuItem>
    </Menu>
  );
};
export default AddCollectionMenu;
