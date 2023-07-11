import { Add, Link, MoveDown } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunCreateSubCollectionMutation,
  useCanRunUpdateCollectionParentsMutation,
  useCreateSubCollectionMutation,
  useUpdateCollectionParentsMutation,
} from '../../../graphql/APIConnector';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';

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

  const [updateCollectionParents] = useUpdateCollectionParentsMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
  });
  const { canRun: canUpdateCollectionParents } = useCanRunUpdateCollectionParentsMutation();

  const [createSubCollection] = useCreateSubCollectionMutation({
    refetchQueries: ['getCollectionInfoById', 'getAllCollections'],
  });
  const { canRun: canCreateSubCollection } = useCanRunCreateSubCollectionMutation();

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
          updateCollectionParents({
            variables: {
              collectionId: selectedCollection.id,
              parentCollectionIds: parents,
            },
          });
        }
      });
    },
    [updateCollectionParents, parentCollectionId, dialog, t]
  );

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
      {canCreateSubCollection && (
        <MenuItem onClick={() => onCreateSubCollection()}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText>{t('curator.createCollection')}</ListItemText>
        </MenuItem>
      )}
      {canUpdateCollectionParents && (
        <MenuItem onClick={() => onLinkOrMoveSubcollection(false)}>
          <ListItemIcon>
            <Link />
          </ListItemIcon>
          <ListItemText>{t('curator.linkCollection')}</ListItemText>
        </MenuItem>
      )}
      {canUpdateCollectionParents && (
        <MenuItem onClick={() => onLinkOrMoveSubcollection(true)}>
          <ListItemIcon>
            <MoveDown />
          </ListItemIcon>
          <ListItemText>{t('curator.moveCollection')}</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
};
export default AddCollectionMenu;
