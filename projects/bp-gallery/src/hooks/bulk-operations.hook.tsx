import {
  Add,
  CreateNewFolder,
  DriveFileMove,
  Edit,
  Filter,
  FolderDelete,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BulkOperation } from '../components/common/picture-gallery/BulkOperationsPanel';
import { AlertContext, AlertType } from '../components/provider/AlertProvider';
import { DialogPreset, useDialog } from '../components/provider/DialogProvider';
import { ExhibitionIdContext } from '../components/provider/ExhibitionProvider';
import { useAddExhibitionPictures } from '../components/views/exhibitions/add-exhibition-pictures.hook';
import { useCanRunCreateExhibitionPictureMutation } from '../graphql/APIConnector';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import useManageCollectionPictures from './manage-collection-pictures.hook';
import { useCreateSequence } from './sequences.hook';

export enum ExternalCanRun {
  canBulkEdit,
  canCreatePictureSequence,
}

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

  const createSequence = useCreateSequence();

  const exhibitionId = useContext(ExhibitionIdContext);
  const addExhibitionPictures = useAddExhibitionPictures();
  const { canRun: canAddExhibitionPictures } = useCanRunCreateExhibitionPictureMutation({
    variables: {
      exhibitionIdealotId: exhibitionId,
    },
  });
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
    createSequence: {
      name: t('curator.createSequence'),
      icon: <Filter />,
      action: (selectedPictures: FlatPicture[]) => {
        createSequence(selectedPictures);
      },
      canRun: ExternalCanRun.canCreatePictureSequence,
    },
    bulkEdit: {
      name: t('curator.bulkEdit'),
      icon: <Edit />,
      action: (_selectedPictures: FlatPicture[], onBulkEdit: () => void) => {
        onBulkEdit();
      },
      canRun: ExternalCanRun.canBulkEdit,
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
      canRun: canAddExhibitionPictures,
    },
  } satisfies Record<string, BulkOperation>;
};

export default useBulkOperations;
