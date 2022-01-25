import React, { useCallback, useEffect, useState } from 'react';
import './PictureGrid.scss';
import PictureView from '../../picture/PictureView';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';

const PictureGrid = ({
  pictures,
  hashBase,
  loading,
}: {
  pictures: FlatPicture[];
  hashBase: string;
  loading: boolean;
}) => {
  const calculateMaxRowCount = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));

  const [maxRowCount, setMaxRowCount] = useState<number>(calculateMaxRowCount());
  const [minRowCount, setMinRowCount] = useState<number>(Math.max(2, maxRowCount - 2));
  const [table, setTable] = useState<(FlatPicture | undefined)[][]>([[]]);

  const hashCode = (str: string) => {
    let hash = 0,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return Math.abs(hash) / Math.pow(2, 31);
  };

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

  return (
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
                  <div
                    key={`${rowindex}${colindex}`}
                    className='picture-thumbnail'
                    style={{
                      flex: `${String(
                        (picture.media?.width ?? 1) / (picture.media?.height ?? 1)
                      )} 1 0`,
                      animationDelay: `${colindex * 0.04}s`,
                    }}
                  >
                    <PictureView
                      pictureId={picture.id}
                      pictureIdsInContext={pictures.map(pic => pic.id)}
                      thumbnailUrl={`/${String(picture.media?.formats?.small.url || '')}`}
                      thumbnailMode={true}
                    />
                  </div>
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
