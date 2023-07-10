import { Portal } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { root } from '../../../helpers/app-helpers';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import useGetPictures, { TextFilter } from '../../../hooks/get-pictures.hook';
import { FlatPicture, PictureOverviewType } from '../../../types/additionalFlatTypes';
import PictureView from '../../views/picture/PictureView';
import PicturePreview from './PicturePreview';
import { zoomIntoPicture, zoomOutOfPicture } from './helpers/picture-animations';

const IMAGES_PER_WIDGET = 3;
const IMAGE_WIDGET_WIDTH = 270;
const TWO_HOURS = 2 * 60 * 60 * 1000;

const SinglePicture = ({
  picture,
  size,
  allowClicks,
  navigateToPicture,
  loading,
}: {
  picture?: FlatPicture;
  size: 'big' | 'small';
  allowClicks?: boolean;
  navigateToPicture: (id: string) => void;
  loading: boolean;
}) => {
  return (
    <div className={`${size === 'small' ? 'w-[125px] h-[100px]' : 'w-[260px] h-[200px]'}`}>
      {picture ? (
        <PicturePreview
          picture={picture}
          adornments={[]}
          allowClicks={allowClicks}
          onClick={() => {
            if (!allowClicks) return;
            navigateToPicture(picture.id);
          }}
          inverse
        />
      ) : (
        <div
          className='horizontal-picture-placeholder w-full h-full'
          style={{ flex: `1 1 0`, visibility: loading ? 'visible' : 'hidden' }}
        />
      )}
    </div>
  );
};

const PicturesWidget = ({
  reverse = false,
  bigPictureFirst,
  pictures,
  loading,
  allowClicks,
  navigateToPicture,
}: {
  reverse?: boolean;
  bigPictureFirst?: boolean;
  pictures: FlatPicture[];
  loading: boolean;
  allowClicks?: boolean;
  navigateToPicture: (id: string) => void;
}) => {
  const bigPictureIndex = bigPictureFirst !== reverse ? 0 : 2;
  const smallPictureIndices = bigPictureFirst !== reverse ? [1, 2] : [0, 1];
  return (
    <div className={`flex ${bigPictureFirst ? 'flex-col' : 'flex-col-reverse'} gap-[10px]`}>
      <SinglePicture
        key={pictures.length > bigPictureIndex ? pictures[bigPictureIndex].id : bigPictureIndex}
        picture={pictures.length > bigPictureIndex ? pictures[bigPictureIndex] : undefined}
        size='big'
        navigateToPicture={navigateToPicture}
        allowClicks={allowClicks}
        loading={loading}
      />
      <div className={`flex ${reverse ? 'flex-row-reverse' : 'flex-row'} gap-[10px]`}>
        {smallPictureIndices.map(i => (
          <SinglePicture
            key={pictures.length > i ? pictures[i].id : i}
            picture={pictures.length > i ? pictures[i] : undefined}
            size='small'
            navigateToPicture={navigateToPicture}
            allowClicks={allowClicks}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

const HorizontalPictureGrid = ({
  date,
  allowClicks,
  setDate,
}: {
  date: number;
  allowClicks?: boolean;
  setDate: Dispatch<SetStateAction<number>>;
}) => {
  const pictureLength = useRef<number>(0);
  const lastScrollPos = useRef<number>(-1);
  const allowDateUpdate = useRef<boolean>(true);
  const scrollBarRef = useRef<HTMLElement>();

  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const selectedPicture = useRef<FlatPicture | undefined>();

  const [filterDate, setFilterDate] = useState<Date>(
    new Date(new Date(`${date.toString().padStart(4, '0')}-01-01T00:00:00`).getTime() - TWO_HOURS)
  );

  const rightResult = useGetPictures(
    {
      time_range_tag: { start: { gte: filterDate } },
    },
    false,
    ['time_range_tag.start:asc'],
    TextFilter.ONLY_PICTURES,
    50,
    'cache-and-network',
    PictureOverviewType.CUSTOM
  );

  const leftResult = useGetPictures(
    {
      time_range_tag: { start: { lt: filterDate } },
    },
    false,
    ['time_range_tag.start:desc'],
    TextFilter.ONLY_PICTURES,
    2,
    'cache-and-network',
    PictureOverviewType.CUSTOM
  );

  const rightPictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(
    rightResult.data
  )?.pictures;
  const leftPictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(
    leftResult.data
  )?.pictures;

  const pictures = useMemo(() => {
    return [...[...(leftPictures ?? [])].reverse(), ...(rightPictures ?? [])];
  }, [leftPictures, rightPictures]);

  const fetchMoreOnScrollRight = useCallback(
    (count: number) => {
      rightResult.fetchMore({
        variables: {
          pagination: {
            start: rightPictures?.length,
            limit: count,
          },
        },
      });
    },
    [rightPictures?.length, rightResult]
  );

  const fetchMoreOnScrollLeft = useCallback(
    (count: number) => {
      leftResult.fetchMore({
        variables: {
          pagination: {
            start: leftPictures?.length,
            limit: count,
          },
        },
      });
    },
    [leftPictures?.length, leftResult]
  );

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

  const contentLeft = useMemo(() => {
    return (
      <div className='flex flex-row-reverse gap-[10px] py-[8px]'>
        {leftPictures?.map((_, index) => {
          if (!(index % IMAGES_PER_WIDGET)) {
            return (
              <PicturesWidget
                key={index}
                bigPictureFirst={!(index % (IMAGES_PER_WIDGET * 2))}
                pictures={leftPictures.slice(index, index + IMAGES_PER_WIDGET)}
                allowClicks={allowClicks}
                navigateToPicture={navigateToPicture}
                loading={leftResult.loading}
                reverse
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }, [allowClicks, leftPictures, leftResult.loading, navigateToPicture]);

  const contentRight = useMemo(() => {
    return (
      <div className='flex gap-[10px] py-[8px]'>
        {rightPictures?.map((_, index) => {
          if (!(index % IMAGES_PER_WIDGET)) {
            return (
              <PicturesWidget
                key={index}
                bigPictureFirst={!!(index % (IMAGES_PER_WIDGET * 2))}
                pictures={rightPictures.slice(index, index + IMAGES_PER_WIDGET)}
                allowClicks={allowClicks}
                navigateToPicture={navigateToPicture}
                loading={rightResult.loading}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }, [allowClicks, navigateToPicture, rightPictures, rightResult.loading]);

  const content = useMemo(() => {
    return (
      <div className='flex gap-[10px]'>
        {contentLeft}
        {contentRight}
      </div>
    );
  }, [contentLeft, contentRight]);

  const updateCurrentValue = useCallback(() => {
    const field = Math.ceil((scrollBarRef.current?.scrollLeft ?? 0) / IMAGE_WIDGET_WIDTH);
    const index = field * IMAGES_PER_WIDGET + ((leftPictures?.length ?? 0) % IMAGES_PER_WIDGET);
    selectedPicture.current =
      pictures.length > index && index >= 0 ? pictures[index] : pictures[pictures.length - 1];
    const year = new Date(selectedPicture.current.time_range_tag?.start as Date).getFullYear();
    if (leftResult.loading || rightResult.loading) {
      return;
    }
    const lowerBorder = pictures.length
      ? new Date(pictures[0]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    const upperBorder = pictures.length
      ? new Date(pictures[pictures.length - 1]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    if (
      (!lowerBorder || !upperBorder || (lowerBorder <= year && year <= upperBorder)) &&
      allowDateUpdate.current
    ) {
      setDate(year);
    } else if (!allowDateUpdate.current) {
      allowDateUpdate.current = true;
    }
  }, [leftPictures?.length, leftResult.loading, pictures, rightResult.loading, setDate]);

  useEffect(() => {
    if (scrollBarRef.current) {
      scrollBarRef.current.scrollLeft = IMAGE_WIDGET_WIDTH;
    }
  }, [filterDate]);

  useEffect(() => {
    if (!scrollBarRef.current || leftResult.loading) return;

    const newWidgetCount = Math.ceil((leftPictures?.length ?? 0) / IMAGES_PER_WIDGET);
    const oldWidgetCount = Math.ceil(pictureLength.current / IMAGES_PER_WIDGET);

    pictureLength.current = leftPictures?.length ?? 0;
    lastScrollPos.current = Math.max(newWidgetCount - oldWidgetCount, 1) * IMAGE_WIDGET_WIDTH;
    scrollBarRef.current.scrollLeft =
      Math.max(newWidgetCount - oldWidgetCount, 1) * IMAGE_WIDGET_WIDTH;
  }, [leftPictures, leftResult.loading]);

  useEffect(() => {
    if (leftResult.loading || rightResult.loading) return;
    const lowerBorder = pictures.length
      ? new Date(pictures[0]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    const upperBorder = pictures.length
      ? new Date(pictures[pictures.length - 1]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    const newDate = new Date(
      new Date(`${date.toString().padStart(4, '0')}-01-01T00:00:00`).getTime()
    );

    if (!lowerBorder || !upperBorder || !(lowerBorder <= date && date <= upperBorder)) {
      setFilterDate(newDate);
    } else {
      if (
        selectedPicture.current &&
        new Date(selectedPicture.current.time_range_tag?.start as Date).getFullYear() ===
          newDate.getFullYear()
      ) {
        return;
      }
      const index = pictures.findLastIndex(picture => {
        return (
          new Date(picture.time_range_tag?.start as Date).getFullYear() < newDate.getFullYear()
        );
      });
      if (index !== -1 && scrollBarRef.current) {
        const field = Math.floor(index / 3) + ((leftPictures?.length ?? 0) % 3 ? 1 : 0);
        scrollBarRef.current.scrollLeft = field * IMAGE_WIDGET_WIDTH;
      } else {
        setFilterDate(newDate);
      }
    }
  }, [date, leftPictures?.length, leftResult.loading, pictures, rightResult.loading]);

  return (
    <>
      <div className='relative'>
        <ScrollBar
          containerRef={ref => {
            scrollBarRef.current = ref;
          }}
          onScrollX={updateCurrentValue}
          onXReachStart={ref => {
            if (!leftResult.loading && lastScrollPos.current !== ref.scrollLeft) {
              lastScrollPos.current = ref.scrollLeft;
              fetchMoreOnScrollLeft(99);
            }
          }}
          onXReachEnd={ref => {
            if (!rightResult.loading && lastScrollPos.current !== ref.scrollLeft) {
              lastScrollPos.current = ref.scrollLeft;
              fetchMoreOnScrollRight(99);
            }
          }}
        >
          {content}
        </ScrollBar>
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
    </>
  );
};

export default HorizontalPictureGrid;
