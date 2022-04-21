import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { zoomIntoPicture, zoomOutOfPicture } from '../../picture/picture-animation.helpers';
import PictureView from '../../picture/PictureView';
import useAddPicturesToCollection from './add-pictures-to-collection.hook';
import BulkOperationsPanel from './BulkOperationsPanel';
import PictureGrid from './PictureGrid';
import PictureUploadArea, { PictureUploadAreaProps } from './PictureUploadArea';
import './PictureOverview.scss';
import useDeletePicture from './helpers/delete-picture.hook';

export type PictureOverviewProps = {
  pictures: FlatPicture[];
  loading: boolean;
  refetch: () => void;
} & Partial<PictureUploadAreaProps>;

export interface PictureOverviewContextProps {
  selectedPictures: FlatPicture[];
  setSelectedPictures: React.Dispatch<React.SetStateAction<FlatPicture[]>>;
  navigateToPicture: (id: string) => void;
  pictures: FlatPicture[];
  loading: boolean;
  refetch: () => void;
  deletePicture: (picture: FlatPicture) => Promise<void>;
}

export const PictureOverviewContext = React.createContext<PictureOverviewContextProps>({
  loading: false,
  navigateToPicture: () => {},
  pictures: [],
  refetch: () => {},
  selectedPictures: [],
  setSelectedPictures: () => {},
  deletePicture: async () => {},
});

const PictureOverview = ({
  pictures,
  loading,
  refetch,
  ...uploadAreaProps
}: PictureOverviewProps) => {
  const { t } = useTranslation();
  const addPicturesToCollection = useAddPicturesToCollection();
  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const deletePicture = useDeletePicture();

  const navigateToPicture = useCallback(
    (id: string) => {
      setTransitioning(true);
      setFocusedPicture(id);
      window.history.pushState({}, '', `/picture/${id}`);
      zoomIntoPicture(`picture-preview-for-${id}`).then(() => {
        setTransitioning(false);
      });
    },
    [setFocusedPicture]
  );

  const [selectedPictures, setSelectedPictures] = useState<FlatPicture[]>([]);

  const pictureOverviewContextFields: PictureOverviewContextProps = useMemo(
    () => ({
      selectedPictures,
      setSelectedPictures,
      navigateToPicture,
      pictures,
      loading,
      refetch,
      deletePicture,
    }),
    [
      selectedPictures,
      setSelectedPictures,
      navigateToPicture,
      pictures,
      loading,
      refetch,
      deletePicture,
    ]
  );

  return (
    <div className={`${transitioning ? 'transitioning' : ''}`}>
      <PictureUploadArea {...uploadAreaProps} />
      {Boolean(selectedPictures.length) && (
        <BulkOperationsPanel
          operations={[
            {
              name: t('curator.addToCollection'),
              icon: 'add',
              action: () => {
                // Hardcoded id! Just for test purposes!
                addPicturesToCollection(
                  '6',
                  selectedPictures.map(p => p.id)
                );
              },
            },
          ]}
        />
      )}
      <PictureOverviewContext.Provider value={pictureOverviewContextFields}>
        <PictureGrid />
      </PictureOverviewContext.Provider>
      {focusedPicture && (
        <PictureView
          initialPictureId={focusedPicture}
          siblingIds={pictures.map(p => p.id)}
          onBack={(picid: string) => {
            setTransitioning(true);
            zoomOutOfPicture(`picture-preview-for-${picid}`).then(() => {
              setTransitioning(false);
              setFocusedPicture(undefined);
            });
          }}
        />
      )}
    </div>
  );
};

export default PictureOverview;
