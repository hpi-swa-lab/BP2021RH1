import React, { useCallback, useEffect, useState } from 'react';
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
import { Button, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CheckBox, CheckBoxOutlineBlank, Delete } from '@mui/icons-material';

export type PictureGridProps = {
  pictures: FlatPicture[];
  hashBase: string;
  loading: boolean;
  bulkOperations?: BulkOperation[];
  refetch: () => void;
  extraAdornments?: PicturePreviewAdornment[];
  showDefaultAdornments?: boolean;
  allowClicks?: boolean;
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
}: PictureGridProps) => {
  const calculateMaxRowCount = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));

  const { role } = useAuth();
  const { t } = useTranslation();

  const [maxRowCount, setMaxRowCount] = useState<number>(calculateMaxRowCount());
  const [minRowCount, setMinRowCount] = useState<number>(Math.max(2, maxRowCount - 2));
  const [table, setTable] = useState<(FlatPicture | undefined)[][]>([[]]);
  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
  const [focusedBulkEdit, setFocusedBulkEdit] = useState<string | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const deletePicture = useDeletePicture();

  // Initialize table with pictures from props
  useEffect(() => {
    const buffer: (FlatPicture | undefined)[][] = [[]];
    let currentRow = 0;
    let currentRowCount = 0;
    let rowLength = Math.round(hashCode(hashBase) * (maxRowCount - minRowCount) + minRowCount);
    for (let i = 0; i < pictures.length; i++) {
      buffer[currentRow].push(pictures[i]);
      currentRowCount++;
      if (currentRowCount >= rowLength) {
        // In the next iteration the next row starts
        currentRow++;
        buffer.push([]);
        currentRowCount = 0;
        rowLength = Math.round(
          hashCode(hashBase + String(i * 124.22417246)) * (maxRowCount - minRowCount) + minRowCount
        );
      }
    }
    for (let i = currentRowCount; i < rowLength; i++) {
      buffer[buffer.length - 1].push(undefined);
    }
    setTable(buffer);
  }, [maxRowCount, minRowCount, pictures, hashBase]);

  const onResize = useCallback(() => {
    const newMaxRowCount = calculateMaxRowCount();
    if (newMaxRowCount !== maxRowCount) {
      setMaxRowCount(newMaxRowCount);
      setMinRowCount(Math.max(2, newMaxRowCount - 2));
    }
  }, [maxRowCount]);

  // Set up eventListener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

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

  const navigateToBulkEdit = useCallback(
    (pictureIds: string) => {
      setFocusedBulkEdit(pictureIds);
      window.history.pushState({}, '', `/bulk-edit/${pictureIds}`);
    },
    [setFocusedBulkEdit]
  );

  const [selectedPictures, setSelectedPictures] = useState<FlatPicture[]>([]);
  const [lastSelectedPicture, setLastSelectedPicture] = useState<FlatPicture | null>(null);

  const selectAll = useCallback(() => {
    setSelectedPictures(pictures);
  }, [pictures]);
  const selectNone = useCallback(() => {
    setSelectedPictures([]);
  }, []);

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
              selectedPictures.includes(picture) ? <CheckBox /> : <CheckBoxOutlineBlank />,
            onClick: (clickedPicture, event) => {
              if (lastSelectedPicture !== null && event.shiftKey) {
                const lastIndex = pictures.indexOf(lastSelectedPicture);
                const clickedIndex = pictures.indexOf(clickedPicture);
                const [fromIndex, toIndex] =
                  lastIndex < clickedIndex ? [lastIndex, clickedIndex] : [clickedIndex, lastIndex];
                setSelectedPictures(currentSelected =>
                  union(currentSelected, pictures.slice(fromIndex, toIndex + 1))
                );
              } else {
                setSelectedPictures(currentSelected =>
                  currentSelected.includes(clickedPicture)
                    ? currentSelected.filter(p => p !== clickedPicture)
                    : [...currentSelected, clickedPicture]
                );
              }
              setLastSelectedPicture(clickedPicture);
            },
            position: 'bottom-left',
            title: t('pictureAdornments.select'),
          } as PicturePreviewAdornment,
        ]
      : undefined;

  const pictureAdornments = (defaultAdornments ?? []).concat(extraAdornments ?? []);

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
      {focusedBulkEdit && (
        <BulkEditView
          pictureIds={selectedPictures.map(picture => picture.id)}
          onBack={() => {
            setFocusedBulkEdit(undefined);
          }}
        />
      )}
    </div>
  );
};

export default PictureGrid;
