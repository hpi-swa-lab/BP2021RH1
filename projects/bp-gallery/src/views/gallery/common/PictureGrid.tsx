import React, { useEffect, useState } from 'react';
import { apiBase } from '../../../ApiConnector';
import './PictureGrid.scss';

const PictureGrid = (props?: { pictures: { [key: number]: any }; hashBase: string }) => {
  const [maxRowCount, setMaxRowCount] = useState<number>(
    Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200))
  );
  let _maxRowCount = 5;
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
    let randCount = Math.round(
      hashCode(props?.hashBase ?? '') * (maxRowCount - minRowCount) + minRowCount
    );
    for (
      let i = 0;
      i <= Math.max(...(Object.keys(props?.pictures || {}) as unknown as number[]));
      i++
    ) {
      buffer[buffer.length - 1].push(props?.pictures[i] || { placeholder: true });
      currentRowCount++;
      if (currentRowCount >= randCount) {
        randCount = Math.round(
          hashCode((props?.hashBase ?? '') + String(i * 124.22417246)) *
            (maxRowCount - minRowCount) +
            minRowCount
        );
        currentRowCount = 0;
        buffer.push([]);
      }
    }
    for (let i = currentRowCount; i < randCount; i++) {
      buffer[buffer.length - 1].push({ placeholder: true });
    }
    setTable(buffer);
  }, [maxRowCount, minRowCount, props?.pictures, props?.hashBase]);

  window.addEventListener('resize', () => {
    const newMaxRowCount = Math.max(2, Math.round(Math.min(window.innerWidth, 1200) / 200));
    if (newMaxRowCount !== _maxRowCount) {
      _maxRowCount = newMaxRowCount; // if we would use maxWRowCount, the useEffect() would be triggered multipe times until the state is changed
      setMaxRowCount(_maxRowCount);
      setMinRowCount(Math.max(2, maxRowCount - 2));
    }
  });

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
                    style={{ flex: `1 1 0` }}
                  ></div>
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
                    <img src={`${apiBase}/${String(picture.media?.formats?.small.url || '')}`} />
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
