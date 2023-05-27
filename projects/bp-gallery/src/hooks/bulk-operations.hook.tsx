import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import { useDialog, DialogPreset } from '../components/provider/DialogProvider';
import useManageCollectionPictures from './manage-collection-pictures.hook';
import { Add, Close, DriveFileMove, Edit } from '@mui/icons-material';
import { BulkOperation } from '../components/common/picture-gallery/BulkOperationsPanel';
import { ExhibitionIdContext } from '../components/provider/ExhibitionProvider';
import { useCreateExhibitionPictureMutation } from '../graphql/APIConnector';
import { addExhibitionPicture } from '../components/views/exhibitions/exhibition-helper';

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

  return {
    linkToCollection: {
      name: t('curator.addToCollection'),
      icon: <Add />,
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
      icon: <Close />,
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
          addExhibitionPicture(createExhibitionPicture, exhibitionId, selectedPictures);
      },
    },
  } satisfies Record<string, BulkOperation>;
};

export default useBulkOperations;
