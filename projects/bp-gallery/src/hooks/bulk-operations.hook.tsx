import { useCallback, useContext } from 'react';
import { CreateNewFolder, DriveFileMove, Edit, FolderDelete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BulkOperation } from '../components/common/picture-gallery/BulkOperationsPanel';
import { DialogPreset, useDialog } from '../components/provider/DialogProvider';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import useManageCollectionPictures from './manage-collection-pictures.hook';
import { ExhibitionIdContext } from '../components/provider/ExhibitionProvider';
import { AddExhibitionPicture } from '../components/views/exhibitions/ExhibitionHelper';
import { AlertContext, AlertType } from '../components/provider/AlertProvider';
import { useCreateExhibitionPictureMutation } from '../graphql/APIConnector';

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
  const [createExhibitionPicture] = useCreateExhibitionPictureMutation();
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
      icon: <Add />,
      action: async (selectedPictures: FlatPicture[]) => {
        exhibitionId &&
          (await AddExhibitionPicture(exhibitionId, selectedPictures, createExhibitionPicture));
        openAlert({
          alertType: AlertType.SUCCESS,
          message: t('exhibition.add-pictures-to-collection-success'),
          duration: 2000,
        });
      },
    },
  } satisfies Record<string, BulkOperation>;
};

export default useBulkOperations;
