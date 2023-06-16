import { CreateNewFolder, DriveFileMove, Edit, Filter, FolderDelete } from '@mui/icons-material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BulkOperation } from '../components/common/picture-gallery/BulkOperationsPanel';
import { DialogPreset, useDialog } from '../components/provider/DialogProvider';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import useManageCollectionPictures from './manage-collection-pictures.hook';
import { useCreateSequence } from './sequences.hook';

const useBulkOperations = (parentCollection?: FlatCollection) => {
  const { t } = useTranslation();
  const dialog = useDialog();

  const { addPicturesToCollection, removePicturesFromCollection } = useManageCollectionPictures();

  const selectCollection = useCallback(() => {
    return dialog({
      content: '',
      preset: DialogPreset.SELECT_COLLECTION,
    });
  }, [dialog]);

  const createSequence = useCreateSequence();

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
    },
    createSequence: {
      name: t('curator.createSequence'),
      icon: <Filter />,
      action: (selectedPictures: FlatPicture[]) => {
        createSequence(selectedPictures);
      },
    },
    bulkEdit: {
      name: t('curator.bulkEdit'),
      icon: <Edit />,
      action: (_selectedPictures: FlatPicture[], onBulkEdit: () => void) => {
        onBulkEdit();
      },
    },
  } satisfies Record<string, BulkOperation>;
};

export default useBulkOperations;
