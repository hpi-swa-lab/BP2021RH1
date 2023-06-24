import { Add, CreateNewFolder, DriveFileMove, Edit, FolderDelete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BulkOperation } from '../components/common/picture-gallery/BulkOperationsPanel';
import { AlertContext, AlertType } from '../components/provider/AlertProvider';
import { DialogPreset, useDialog } from '../components/provider/DialogProvider';
import { ExhibitionIdContext } from '../components/provider/ExhibitionProvider';
import { useAddExhibitionPictures } from '../components/views/exhibitions/add-exhibition-pictures.hook';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import useManageCollectionPictures from './manage-collection-pictures.hook';

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

  const exhibitionId = useContext(ExhibitionIdContext);
  const addExhibitionPictures = useAddExhibitionPictures();
  const openAlert = useContext(AlertContext);

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
    bulkEdit: {
      name: t('curator.bulkEdit'),
      icon: <Edit />,
      action: (_selectedPictures: FlatPicture[], onBulkEdit: () => void) => {
        onBulkEdit();
      },
    },
    addToExhibition: {
      name: t('curator.addToExhibition'),
      icon: (
        <Button variant='contained'>
          <Add /> {t('curator.addToExhibition')}
        </Button>
      ),
      action: async (selectedPictures: FlatPicture[]) => {
        if (!exhibitionId)
          return openAlert({
            alertType: AlertType.ERROR,
            message: t('exhibition.add-picture-to-collection-error'),
          });
        await addExhibitionPictures(exhibitionId, selectedPictures);
        openAlert({
          alertType: AlertType.SUCCESS,
          message: t('exhibition.add-picture-to-collection-success', { count: 2 }),
          duration: 2000,
        });
      },
    },
  } satisfies Record<string, BulkOperation>;
};

export default useBulkOperations;
