import { History } from 'history';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import { DialogContext, DialogPreset } from '../components/provider/DialogProvider';
import useManageCollectionPictures from './manage-collection-pictures.hook';
import { useHistory } from 'react-router-dom';

const useBulkOperations = (parentCollection?: FlatCollection) => {
  const { t } = useTranslation();
  const dialog = useContext(DialogContext);
  const history: History = useHistory();

  const { addPicturesToCollection, removePicturesFromCollection } = useManageCollectionPictures();

  const selectCollection = useCallback(() => {
    return dialog({
      content: '',
      preset: DialogPreset.SELECT_COLLECTION,
    });
  }, [dialog]);

  return {
    linkToCollection: {
      name: t('curator.addToCollection'),
      icon: 'add',
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
      icon: 'close',
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
      icon: 'drive_file_move',
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
    bulkEdit: {
      name: t('curator.bulkEdit'),
      icon: 'edit',
      action: (selectedPictures: FlatPicture[]) => {
        history.push(`/bulk-edit/${selectedPictures.map(p => p.id).join(',')}`);
      },
    },
  };
};

export default useBulkOperations;
