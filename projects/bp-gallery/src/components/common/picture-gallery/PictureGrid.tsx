import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { CheckBox, CheckBoxOutlineBlank, Delete, DoneAll, RemoveDone } from '@mui/icons-material';
import { IconButton, Portal } from '@mui/material';
import { isFunction, union } from 'lodash';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { root } from '../../../helpers/app-helpers';
import hashCode from '../../../helpers/hash-code';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import { useCanBulkEditSomePictures, useCanUseBulkEditView } from '../../../hooks/can-do-hooks';
import useDeletePicture, { useCanDeletePicture } from '../../../hooks/delete-picture.hook';
import { useMouseAndTouchSensors } from '../../../hooks/sensors.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import BulkEditView from '../../views/bulk-edit/BulkEditView';
import PictureView from '../../views/picture/PictureView';
import SortableItem from '../SortableItem';
import BulkOperationsPanel, { BulkOperation } from './BulkOperationsPanel';
import './PictureGrid.scss';
import PicturePreview, {
  CustomPicturePreviewAdornmentComponent,
  CustomPicturePreviewAdornmentConfig,
  DefaultPicturePreviewAdornment,
  DefaultPicturePreviewAdornmentConfig,
  PicturePreviewAdornment,
} from './PicturePreview';
import { zoomIntoPicture, zoomOutOfPicture } from './helpers/picture-animations';

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
  onSort?: (newPictures: FlatPicture[]) => void;
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
  onSort,
}: PictureGridProps) => {
  const ref = useRef<any>();

  const calculateMaxPicturesPerRow = useCallback((width: number) => {
    return Math.max(2, Math.round(Math.min(width, 1200) / 200));
  }, []);

  const { t } = useTranslation();

  const [maxRowLength, setMaxRowLength] = useState<number>(
    calculateMaxPicturesPerRow((ref.current?.clientWidth ?? window.innerWidth) as number)
  );
  const [table, setTable] = useState<(FlatPicture | undefined)[][]>([[]]);
  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
  const [bulkEditPictureIds, setBulkEditPictureIds] = useState<string[] | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const minRowLength = Math.max(2, maxRowLength - 2);

  const calculatePicturesPerRowWithHashKey = useCallback(
    (hashKey: string) => {
      return Math.round(hashCode(hashKey) * (maxRowLength - minRowLength) + minRowLength);
    },
    [maxRowLength, minRowLength]
  );

  const calculatePicturesPerRow = useCallback(
    (offset?: number) => {
      return calculatePicturesPerRowWithHashKey(
        offset ? hashBase + String(offset * 124.22417246) : hashBase
      );
    },
    [hashBase, calculatePicturesPerRowWithHashKey]
  );

  const calculatePictureNumber = useCallback(() => {
    if (!rows) {
      return pictures.length;
    }
    let pictureNumber = calculatePicturesPerRow();
    for (let row = 1; row < rows; row++) {
      pictureNumber += calculatePicturesPerRow(pictureNumber - 1);
    }
    return pictureNumber;
  }, [rows, pictures.length, calculatePicturesPerRow]);

  const onResize = useCallback(() => {
    const newMaxRowLength = calculateMaxPicturesPerRow(
      (ref.current?.clientWidth ?? window.innerWidth) as number
    );
    if (newMaxRowLength !== maxRowLength) {
      setMaxRowLength(newMaxRowLength);
    }
  }, [maxRowLength, calculateMaxPicturesPerRow]);

  //ensure correct set up of
  useEffect(() => {
    setMaxRowLength(
      calculateMaxPicturesPerRow((ref.current?.clientWidth ?? window.innerWidth) as number)
    );
  }, [ref.current?.clientWidth, calculateMaxPicturesPerRow]);

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
    let rowLength = calculatePicturesPerRow();
    for (let i = 0; i < calculatePictureNumber(); i++) {
      buffer[currentRow].push(pictures[i]);
      currentRowCount++;
      if (currentRowCount >= rowLength) {
        // In the next iteration the next row starts
        currentRow++;
        buffer.push([]);
        currentRowCount = 0;
        rowLength = calculatePicturesPerRow(i);
      }
    }
    for (let i = currentRowCount; i < rowLength; i++) {
      buffer[buffer.length - 1].push(undefined);
    }
    setTable(buffer);
  }, [pictures, calculatePictureNumber, calculatePicturesPerRow]);

  const navigateToPicture = useCallback(
    (id: string) => {
      setTransitioning(true);
      setFocusedPicture(id);
      pushHistoryWithoutRouter(`/picture/${id}`);
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
    pushHistoryWithoutRouter(`/bulk-edit/${selectedPictureIds.join(',')}`);
  }, [setBulkEditPictureIds, selectedPictureIds]);

  const { canUseBulkEditView: canBulkEdit } = useCanUseBulkEditView(selectedPictureIds);

  const { canBulkEditSomePictures } = useCanBulkEditSomePictures();

  const canSelect = useMemo(
    () =>
      // Show selection boxes when at least one bulkOperation is available.
      // Operations which have a function as their `canRun` depend on BulkEdit
      // being available, so they get treated as available if the user can bulk edit
      // some pictures in any archive because the availability of BulkEdit depends on
      // selections being present.
      bulkOperations?.some(
        operation =>
          operation.canRun === true || (isFunction(operation.canRun) && canBulkEditSomePictures)
      ) ?? false,
    [bulkOperations, canBulkEditSomePictures]
  );

  const defaultAdornments: PicturePreviewAdornment[] = useMemo(
    () =>
      showDefaultAdornments
        ? [
            {
              component: DeletePicturePreviewAdornment,
              extraProps: {
                refetch,
              },
            } satisfies CustomPicturePreviewAdornmentConfig<DeletePicturePreviewAdornmentExtraProps>,
            ...(canSelect
              ? [
                  {
                    icon: picture =>
                      selectedPictureIds.includes(picture.id) ? (
                        <CheckBox />
                      ) : (
                        <CheckBoxOutlineBlank />
                      ),
                    onClick: (clickedPicture, event) => {
                      if (lastSelectedPictureId !== null && event.shiftKey) {
                        const lastIndex = pictures.findIndex(
                          picture => picture.id === lastSelectedPictureId
                        );
                        const clickedIndex = pictures.indexOf(clickedPicture);
                        const [fromIndex, toIndex] =
                          lastIndex < clickedIndex
                            ? [lastIndex, clickedIndex]
                            : [clickedIndex, lastIndex];
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
                  } satisfies PicturePreviewAdornment,
                ]
              : []),
          ]
        : [],
    [
      showDefaultAdornments,
      refetch,
      canSelect,
      selectedPictureIds,
      lastSelectedPictureId,
      pictures,
      t,
    ]
  );

  const pictureAdornments = useMemo(
    () => defaultAdornments.concat(extraAdornments ?? []),
    [defaultAdornments, extraAdornments]
  );

  const renderGrid = useCallback(
    (
      wrap: (picture: FlatPicture, preview: ReactNode) => ReactNode = (_picture, preview) => preview
    ) => {
      return table.map((row, rowindex) => {
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
                return wrap(
                  picture,
                  <PicturePreview
                    key={picture.id}
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
      });
    },
    [allowClicks, loading, navigateToPicture, pictureAdornments, table]
  );

  const sensors = useMouseAndTouchSensors();
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!onSort) {
        return;
      }
      const { active, over } = event;

      if (!over || active.id === over.id) return;
      onSort(
        arrayMove(
          pictures,
          pictures.findIndex(picture => picture.id === active.id),
          pictures.findIndex(picture => picture.id === over.id)
        )
      );
    },
    [onSort, pictures]
  );

  return (
    <div className={`${transitioning ? 'transitioning' : ''}`} ref={ref}>
      <div className='empty:hidden sticky top-2 z-10 bg-[#ccccccee] p-2 mt-8 rounded-md [&>.MuiIconButton-root>svg]:!text-[28px]'>
        {Boolean(selectedPictures.length) && bulkOperations && (
          <BulkOperationsPanel
            operations={bulkOperations}
            selectedPictures={selectedPictures}
            onBulkEdit={navigateToBulkEdit}
            canBulkEdit={canBulkEdit}
          />
        )}
        {canSelect && (
          <>
            <IconButton onClick={selectAll} color='primary' title={t('curator.selectAll')}>
              <DoneAll />
            </IconButton>
            <IconButton onClick={selectNone} color='primary' title={t('curator.selectNone')}>
              <RemoveDone />
            </IconButton>
          </>
        )}
      </div>
      <div className='picture-grid'>
        {onSort ? (
          <DndContext onDragEnd={onDragEnd} sensors={sensors}>
            <SortableContext
              items={table.flatMap(row =>
                row
                  .filter((picture): picture is FlatPicture => !!picture)
                  .map(picture => picture.id)
              )}
            >
              {renderGrid((picture, preview) => (
                <SortableItem id={picture.id} key={picture.id}>
                  {preview}{' '}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          renderGrid()
        )}
      </div>
      {focusedPicture && !transitioning && (
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

export type DeletePicturePreviewAdornmentExtraProps = {
  refetch: () => void;
};

export const DeletePicturePreviewAdornment: CustomPicturePreviewAdornmentComponent<
  DeletePicturePreviewAdornmentExtraProps
> = ({ context, extraProps: { refetch } }) => {
  const { t } = useTranslation();

  const deletePicture = useDeletePicture();
  const { canDeletePicture } = useCanDeletePicture(context.picture.id);

  const config: DefaultPicturePreviewAdornmentConfig = useMemo(
    () => ({
      icon: <Delete />,
      onClick: (clickedPicture: FlatPicture) => {
        deletePicture(clickedPicture).then(() => refetch());
      },
      position: 'top-right',
      title: t('pictureAdornments.delete'),
    }),
    [deletePicture, refetch, t]
  );

  if (!canDeletePicture) {
    return null;
  }

  return <DefaultPicturePreviewAdornment config={config} context={context} />;
};
