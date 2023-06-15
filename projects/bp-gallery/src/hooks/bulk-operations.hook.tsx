import { CreateNewFolder, DriveFileMove, Edit, FolderDelete } from '@mui/icons-material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BulkOperation } from '../components/common/picture-gallery/BulkOperationsPanel';
import { DialogPreset, useDialog } from '../components/provider/DialogProvider';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import useManageCollectionPictures from './manage-collection-pictures.hook';

const useBulkOperations = (parentCollection?: FlatCollection) => {
  const { t } = useTranslation();
  const dialog = useDialog();

  const { addPicturesToCollection, removePicturesFromCollection, canManageCollectionPictures } =
    useManageCollectionPictures();

  const selectCollection = useCallback(() => {
    return dialog({
      content: '',
      preset: DialogPreset.SELECT_COLLECTION,
    });
  }, [dialog]);

  return {
    linkToCollection: {
      name: t('curator.addToCollection'),
      icon: <CreateNewFolder />,
      action: (selectedPictures: FlatPicture[]) => {
        selectCollection().then((selectedCollection: FlatCollection | undefined) => {
          if (!selectedCollection?.id) {
            return;
          }
          addPicturesToCollection(
            selectedCollection.id,
            selectedPictures.map(p => p.id)
          );
        });
      },
      canRun: canManageCollectionPictures,
    },
    removeFromCollection: {
      name: t('curator.removeFromCollection'),
      icon: <FolderDelete />,
      action: (selectedPictures: FlatPicture[]) => {
        if (!parentCollection?.id) {
          return;
        }
        removePicturesFromCollection(
          parentCollection.id,
          selectedPictures.map(p => p.id)
        );
      },
      canRun: canManageCollectionPictures && parentCollection !== undefined,
    },
    moveToCollection: {
      name: t('curator.moveToCollection'),
      icon: <DriveFileMove />,
      action: (selectedPictures: FlatPicture[]) => {
        selectCollection().then((selectedCollection: FlatCollection | undefined) => {
          if (!selectedCollection?.id) {
            return;
          }
          addPicturesToCollection(
            selectedCollection.id,
            selectedPictures.map(p => p.id)
          );
          if (parentCollection?.id) {
            removePicturesFromCollection(
              parentCollection.id,
              selectedPictures.map(p => p.id)
            );
          }
        });
      },
      canRun: canManageCollectionPictures,
    },
    bulkEdit: {
      name: t('curator.bulkEdit'),
      icon: <Edit />,
      action: (_selectedPictures: FlatPicture[], onBulkEdit: () => void) => {
        onBulkEdit();
      },
      canRun: canBulkEdit => canBulkEdit,
    },
  } satisfies Record<string, BulkOperation>;
};

export default useBulkOperations;
