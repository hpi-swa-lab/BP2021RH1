import { useCallback, useEffect, useMemo, useState } from 'react';
import './PictureGrid.scss';
import PictureView from '../../views/picture/PictureView';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import hashCode from '../../../helpers/hash-code';
import { zoomIntoPicture, zoomOutOfPicture } from './helpers/picture-animations';
import PicturePreview, { PicturePreviewAdornment } from './PicturePreview';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import BulkOperationsPanel, { BulkOperation } from './BulkOperationsPanel';
import useDeletePicture from '../../../hooks/delete-picture.hook';
import BulkEditView from '../../views/bulk-edit/BulkEditView';
import { union } from 'lodash';
import { Button, Icon, Portal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CheckBox, CheckBoxOutlineBlank, Delete } from '@mui/icons-material';
import { root } from '../../../helpers/app-helpers';

export type PictureGridProps = {
  pictures: FlatPicture[];
  hashBase: string;
  loading: boolean;
  bulkOperations?: BulkOperation[];
  refetch: () => void;
  extraAdornments?: PicturePreviewAdornment[];
  showDefaultAdornments?: boolean;
  allowClicks?: boolean;
  rows?: number;
};

const PictureGrid = ({
  pictures,
  hashBase,
  loading,
  bulkOperations,
  refetch,
  extraAdornments,
  showDefaultAdornments = true,
  allowClicks = true,
  rows,
}: PictureGridProps) => {
  const calculateMaxPicturesPerRow = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));

  const calculateMinPicturesPerRow = (maxRowLength: number) => Math.max(2, maxRowLength - 2);

  const { role } = useAuth();
  const { t } = useTranslation();

  const [maxRowLength, setMaxRowLength] = useState<number>(calculateMaxPicturesPerRow());
  const [table, setTable] = useState<(FlatPicture | undefined)[][]>([[]]);
  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
  const [bulkEditPictureIds, setBulkEditPictureIds] = useState<string[] | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const calculatePicturesPerRow = (maxRowLength: number, minRowLength: number, hashKey: string) =>
    Math.round(hashCode(hashKey) * (maxRowLength - minRowLength) + minRowLength);

  const calculatePictureNumber = useCallback(() => {
    if (!rows) {
      return pictures.length;
    }
    const minRowLength = calculateMinPicturesPerRow(maxRowLength);
    let pictureNumber = calculatePicturesPerRow(maxRowLength, minRowLength, hashBase);
    for (let row = 1; row < rows; row++) {
      pictureNumber += calculatePicturesPerRow(
        maxRowLength,
        minRowLength,
        hashBase + String((pictureNumber - 1) * 124.22417246)
      );
    }
    return pictureNumber;
  }, [rows, maxRowLength, pictures.length, hashBase]);

  const deletePicture = useDeletePicture();

  const onResize = useCallback(() => {
    const newMaxRowLength = calculateMaxPicturesPerRow();
    if (newMaxRowLength !== maxRowLength) {
      setMaxRowLength(newMaxRowLength);
    }
  }, [maxRowLength]);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  // Initialize table with pictures from props
  useEffect(() => {
    const buffer: (FlatPicture | undefined)[][] = [[]];
    let currentRow = 0;
    let currentRowCount = 0;
    const minRowLength = calculateMinPicturesPerRow(maxRowLength);
    let rowLength = calculatePicturesPerRow(maxRowLength, minRowLength, hashBase);
    for (let i = 0; i < calculatePictureNumber(); i++) {
      buffer[currentRow].push(pictures[i]);
      currentRowCount++;
      if (currentRowCount >= rowLength) {
        // In the next iteration the next row starts
        currentRow++;
        buffer.push([]);
        currentRowCount = 0;
        rowLength = Math.round(
          hashCode(hashBase + String(i * 124.22417246)) * (maxRowLength - minRowLength) +
            minRowLength
        );
      }
    }
    for (let i = currentRowCount; i < rowLength; i++) {
      buffer[buffer.length - 1].push(undefined);
    }
    setTable(buffer);
  }, [pictures, hashBase, calculatePictureNumber, maxRowLength]);

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

  const [selectedPictureIds, setSelectedPictureIds] = useState<string[]>([]);
  const [lastSelectedPictureId, setLastSelectedPictureId] = useState<string | null>(null);

  // prevent old ids from being referenced above
  useEffect(() => {
    setSelectedPictureIds(current =>
      current.filter(id => pictures.find(picture => picture.id === id))
    );
    setLastSelectedPictureId(current =>
      pictures.find(picture => picture.id === current) ? current : null
    );
  }, [pictures]);

  const selectedPictures = useMemo(
    () => pictures.filter(picture => selectedPictureIds.includes(picture.id)),
    [pictures, selectedPictureIds]
  );

  const selectAll = useCallback(() => {
    setSelectedPictureIds(pictures.map(picture => picture.id));
  }, [pictures]);
  const selectNone = useCallback(() => {
    setSelectedPictureIds([]);
  }, []);

  const navigateToBulkEdit = useCallback(() => {
    setBulkEditPictureIds(selectedPictureIds);
    window.history.pushState({}, '', `/bulk-edit/${selectedPictureIds.join(',')}`);
  }, [setBulkEditPictureIds, selectedPictureIds]);

  const defaultAdornments =
    role >= AuthRole.CURATOR && showDefaultAdornments
      ? [
          {
            icon: <Delete />,
            onClick: (clickedPicture: FlatPicture) => {
              deletePicture(clickedPicture).then(() => refetch());
            },
            position: 'top-right',
            title: t('pictureAdornments.delete'),
          } as PicturePreviewAdornment,
          {
            icon: picture =>
              selectedPictureIds.includes(picture.id) ? <CheckBox /> : <CheckBoxOutlineBlank />,
            onClick: (clickedPicture, event) => {
              if (lastSelectedPictureId !== null && event.shiftKey) {
                const lastIndex = pictures.findIndex(
                  picture => picture.id === lastSelectedPictureId
                );
                const clickedIndex = pictures.indexOf(clickedPicture);
                const [fromIndex, toIndex] =
                  lastIndex < clickedIndex ? [lastIndex, clickedIndex] : [clickedIndex, lastIndex];
                setSelectedPictureIds(currentSelected =>
                  union(
                    currentSelected,
                    pictures.slice(fromIndex, toIndex + 1).map(picture => picture.id)
                  )
                );
              } else {
                setSelectedPictureIds(currentSelected =>
                  currentSelected.includes(clickedPicture.id)
                    ? currentSelected.filter(p => p !== clickedPicture.id)
                    : [...currentSelected, clickedPicture.id]
                );
              }
              setLastSelectedPictureId(clickedPicture.id);
            },
            position: 'bottom-left',
            title: t('pictureAdornments.select'),
          } as PicturePreviewAdornment,
        ]
      : undefined;

  const pictureAdornments = (defaultAdornments ?? []).concat(
    role >= AuthRole.CURATOR ? extraAdornments ?? [] : []
  );

  return (
    <div className={`${transitioning ? 'transitioning' : ''}`}>
      {Boolean(selectedPictures.length) && bulkOperations && (
        <BulkOperationsPanel
          operations={bulkOperations}
          selectedPictures={selectedPictures}
          onBulkEdit={navigateToBulkEdit}
        />
      )}
      {defaultAdornments && (
        <div className='selection-buttons'>
          <Button onClick={selectAll} startIcon={<Icon>done_all</Icon>} variant='contained'>
            {t('curator.selectAll')}
          </Button>
          <Button onClick={selectNone} startIcon={<Icon>remove_done</Icon>} variant='contained'>
            {t('curator.selectNone')}
          </Button>
        </div>
      )}
      <div className='picture-grid'>
        {table.map((row, rowindex) => {
          return (
            <div key={rowindex} className='row'>
              {row.map((picture, colindex) => {
                if (!picture) {
                  return (
                    <div
                      key={`${rowindex}${colindex}`}
                      className='picture-placeholder'
                      style={{ flex: `1 1 0`, visibility: loading ? 'visible' : 'hidden' }}
                    />
                  );
                } else {
                  return (
                    <PicturePreview
                      key={`${rowindex}${colindex}`}
                      picture={picture}
                      onClick={() => {
                        if (!allowClicks) return;
                        navigateToPicture(picture.id);
                      }}
                      adornments={pictureAdornments}
                      allowClicks={allowClicks}
                    />
                  );
                }
              })}
            </div>
          );
        })}
      </div>
      {focusedPicture && (
        <Portal container={root}>
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
        </Portal>
      )}
      {bulkEditPictureIds && (
        <Portal container={root}>
          <BulkEditView
            pictureIds={bulkEditPictureIds}
            onBack={() => {
              setBulkEditPictureIds(undefined);
            }}
            onSave={selectNone}
          />
        </Portal>
      )}
    </div>
  );
};

export default PictureGrid;
