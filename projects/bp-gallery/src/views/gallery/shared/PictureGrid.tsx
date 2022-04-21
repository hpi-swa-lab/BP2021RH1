import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import './PictureGrid.scss';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import hashCode from './helpers/hash-code';
import PicturePreview, { PicturePreviewAdornment } from './PicturePreview';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { PictureOverviewContext } from './PictureOverview';

const PictureGrid = () => {
  const {
    selectedPictures,
    setSelectedPictures,
    navigateToPicture,
    pictures,
    loading,
    refetch,
    deletePicture,
  } = useContext(PictureOverviewContext);

  const calculateMaxRowCount = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 150));

  const hashBase = useMemo(() => {
    return pictures.length ? pictures[0].media?.url ?? '' : '';
  }, [pictures]);

  const { role } = useAuth();

  const [maxRowCount, setMaxRowCount] = useState<number>(calculateMaxRowCount());
  const [minRowCount, setMinRowCount] = useState<number>(Math.max(2, maxRowCount - 2));
  const [grid, setGrid] = useState<(FlatPicture | undefined)[][]>([[]]);

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
    setGrid(buffer);
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
              setSelectedPictures((currentSelected: FlatPicture[]) =>
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
    <div className='picture-grid'>
      {grid.map((row, rowindex) => {
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
  );
};

export default PictureGrid;
