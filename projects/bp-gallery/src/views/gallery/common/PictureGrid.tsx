import React, { useCallback, useEffect, useState } from 'react';
import './PictureGrid.scss';
import PictureView, { PictureViewContextFields } from '../../picture/PictureView';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
import { PictureNavigationTarget } from '../../picture/PictureViewUI';

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
  const [focusedPicture, setFocusedPicture] = useState<{
    id: string;
    params: PictureViewContextFields;
  }>({
    id: '-1',
    params: {},
  });

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

  const navigateToPicture = useCallback(
    (picture: FlatPicture, params: PictureViewContextFields) => {
      setFocusedPicture({
        id: picture.id,
        params,
      });
      window.history.replaceState({}, '', `/picture/${picture.id}`);
    },
    [setFocusedPicture]
  );

  const nextOrPrevPicture = useCallback(
    (picture: FlatPicture, target: PictureNavigationTarget, params: PictureViewContextFields) => {
      const getNextPicture = (currentPictureId: string): FlatPicture | undefined => {
        const indexOfCurrentPictureId: number = pictures.findIndex(
          pic => pic.id === currentPictureId
        );
        return pictures.at(indexOfCurrentPictureId + 1);
      };

      const getPreviousPicture = (currentPictureId: string): FlatPicture | undefined => {
        const indexOfCurrentPictureId: number = pictures.findIndex(
          pic => pic.id === currentPictureId
        );
        return pictures.at(indexOfCurrentPictureId - 1) ?? pictures.at(pictures.length - 1);
      };

      let newPicture: FlatPicture | undefined = picture;
      switch (target) {
        case PictureNavigationTarget.NEXT:
          newPicture = getNextPicture(picture.id);
          break;
        case PictureNavigationTarget.PREVIOUS:
          newPicture = getPreviousPicture(picture.id);
          break;
        default:
          break;
      }

      if (newPicture) {
        navigateToPicture(newPicture, params);
      }
    },
    [navigateToPicture, pictures]
  );

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
                  <PictureView
                    key={`${rowindex}${colindex}`}
                    flexValue={String((picture.media?.width ?? 0) / (picture.media?.height ?? 1))}
                    pictureId={picture.id}
                    navigateCallback={(
                      target: PictureNavigationTarget,
                      params?: PictureViewContextFields
                    ) => {
                      nextOrPrevPicture(picture, target, params ?? {});
                    }}
                    initialParams={focusedPicture.id === picture.id ? focusedPicture.params : {}}
                    hasPrevious={pictures.indexOf(picture) > 0}
                    hasNext={pictures.indexOf(picture) < pictures.length - 1}
                    thumbnailUrl={`/${String(picture.media?.formats?.small.url || '')}`}
                    isInitialThumbnail={focusedPicture.id !== picture.id}
                    openCallback={(open?: boolean) => {
                      setFocusedPicture(
                        open
                          ? {
                              id: picture.id,
                              params: {},
                            }
                          : {
                              id: '-1',
                              params: {},
                            }
                      );
                    }}
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
