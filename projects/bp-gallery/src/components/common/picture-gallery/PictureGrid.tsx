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

export type PictureGridProps = {
  pictures: FlatPicture[];
  hashBase: string;
  loading: boolean;
  bulkOperations?: BulkOperation[];
  refetch: () => void;
};

const PictureGrid = ({
  pictures,
  hashBase,
  loading,
  bulkOperations,
  refetch,
}: PictureGridProps) => {
  const calculateMaxRowCount = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));

  const { role } = useAuth();

  const [maxRowCount, setMaxRowCount] = useState<number>(calculateMaxRowCount());
  const [minRowCount, setMinRowCount] = useState<number>(Math.max(2, maxRowCount - 2));
  const [table, setTable] = useState<(FlatPicture | undefined)[][]>([[]]);
  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
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

  const [selectedPictures, setSelectedPictures] = useState<FlatPicture[]>([]);

  const pictureAdornments =
    role >= AuthRole.CURATOR
      ? [
          {
            icon: 'delete',
            onClick: (clickedPicture: FlatPicture) => {
              deletePicture(clickedPicture).then(() => refetch());
            },
            position: 'top-right',
          } as PicturePreviewAdornment,
          {
            icon: picture =>
              selectedPictures.includes(picture) ? 'check_box' : 'check_box_outline_blank',
            onClick: clickedPicture => {
              setSelectedPictures(currentSelected =>
                currentSelected.includes(clickedPicture)
                  ? currentSelected.filter(p => p !== clickedPicture)
                  : [...currentSelected, clickedPicture]
              );
            },
            position: 'bottom-left',
          } as PicturePreviewAdornment,
        ]
      : undefined;

  return (
    <div className={`${transitioning ? 'transitioning' : ''}`}>
      {Boolean(selectedPictures.length) && bulkOperations && (
        <BulkOperationsPanel operations={bulkOperations} selectedPictures={selectedPictures} />
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
                      onClick={() => navigateToPicture(picture.id)}
                      adornments={pictureAdornments}
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
    </div>
  );
};

export default PictureGrid;
