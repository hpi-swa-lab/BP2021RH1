import React, { useCallback, useEffect, useState } from 'react';
import './PictureGrid.scss';
import PictureView from '../../picture/PictureView';

const PictureGrid = ({
  pictures,
  hashBase,
  loading,
}: {
  pictures: any[];
  hashBase: string;
  loading: boolean;
}) => {
  const calculateMaxRowCount = () =>
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));

  const [maxRowCount, setMaxRowCount] = useState<number>(calculateMaxRowCount());
  const [minRowCount, setMinRowCount] = useState<number>(Math.max(2, maxRowCount - 2));
  const [table, setTable] = useState<any[][]>([[]]);

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

  useEffect(() => {
    const buffer: any[][] = [[]];
    let currentRowCount = 0;
    let randCount = Math.round(hashCode(hashBase) * (maxRowCount - minRowCount) + minRowCount);
    for (let i = 0; i <= Math.max(...(Object.keys(pictures) as unknown as number[])); i++) {
      buffer[buffer.length - 1].push(pictures[i] || { placeholder: true });
      currentRowCount++;
      if (currentRowCount >= randCount) {
        randCount = Math.round(
          hashCode(hashBase + String(i * 124.22417246)) * (maxRowCount - minRowCount) + minRowCount
        );
        currentRowCount = 0;
        buffer.push([]);
      }
    }
    for (let i = currentRowCount; i < randCount; i++) {
      buffer[buffer.length - 1].push({ placeholder: true });
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

  //Set up eventListener on mount and cleanup on unmount
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
              if (picture.placeholder) {
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
                      flex: `${String(picture.media.width / picture.media.height)} 1 0`,
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
