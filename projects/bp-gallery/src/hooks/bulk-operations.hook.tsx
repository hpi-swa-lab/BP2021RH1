import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import { FlatCollection, FlatPicture } from '../types/additionalFlatTypes';
import { useDialog, DialogPreset } from '../components/provider/DialogProvider';
import useManageCollectionPictures from './manage-collection-pictures.hook';
import { Add, Download, DriveFileMove, Close, Edit } from '@mui/icons-material';
import { BulkOperation } from '../components/common/picture-gallery/BulkOperationsPanel';
import { asApiPath } from '../helpers/app-helpers';

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
    downloadCollection: {
      name: 'Download selected pictures',
      icon: <Download />,
      action: (selectedPictures: FlatPicture[]) => {
        selectedPictures.forEach(picture => {
          const pictureLink = picture.media?.url
            ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
            : '';
          saveAs(pictureLink, picture.id);
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
  } satisfies Record<string, BulkOperation>;
};

export default useBulkOperations;
