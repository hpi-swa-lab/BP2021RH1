import { Portal } from '@mui/material';
import { throttle } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { root } from '../../../helpers/app-helpers';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import useGetPictures from '../../../hooks/get-pictures.hook';
import { FlatPicture, PictureOverviewType } from '../../../types/additionalFlatTypes';
import PictureView from '../../views/picture/PictureView';
import PicturePreview from './PicturePreview';
import { zoomIntoPicture, zoomOutOfPicture } from './helpers/picture-animations';

const SinglePicture = ({
  picture,
  size,
  allowClicks,
  navigateToPicture,
}: {
  picture: FlatPicture;
  size: string;
  allowClicks?: boolean;
  navigateToPicture: (id: string) => void;
}) => {
  return (
    <div className={`${size === 'small' ? 'w-[125px] h-[100px]' : 'w-[260px] h-[200px]'}`}>
      <PicturePreview
        key={`${picture.id}`}
        picture={picture}
        adornments={[]}
        allowClicks={allowClicks}
        onClick={() => {
          if (!allowClicks) return;
          navigateToPicture(picture.id);
        }}
        inverse={true}
      />
    </div>
  );
};

const PictureWidget = ({
  variant,
  pictures,
  allowClicks,
  inverse,
  navigateToPicture,
}: {
  variant?: string;
  pictures: FlatPicture[];
  allowClicks?: boolean;
  inverse?: boolean;
  navigateToPicture: (id: string) => void;
}) => {
  return variant === 'var-1' ? (
    <div className={`flex flex-col gap-[10px]`}>
      {pictures.length > (inverse ? 2 : 0) ? (
        <SinglePicture
          key={pictures[inverse ? 2 : 0].id}
          picture={pictures[inverse ? 2 : 0]}
          size={'big'}
          navigateToPicture={navigateToPicture}
          allowClicks={allowClicks}
        />
      ) : null}
      <div className={`flex ${inverse ? 'flex-row-reverse' : 'flex-row'} gap-[10px]`}>
        {(inverse ? [0, 1] : [1, 2]).map(i => {
          return pictures.length > i ? (
            <SinglePicture
              key={pictures[i].id}
              picture={pictures[i]}
              size={'small'}
              navigateToPicture={navigateToPicture}
              allowClicks={allowClicks}
            />
          ) : null;
        })}
      </div>
    </div>
  ) : (
    <div className={`flex flex-col gap-[10px]`}>
      <div className={`flex ${inverse ? 'flex-row-reverse' : 'flex-row'} gap-[10px]`}>
        {(inverse ? [1, 2] : [0, 1]).map(i => {
          return pictures.length > i ? (
            <SinglePicture
              key={pictures[i].id}
              picture={pictures[i]}
              size={'small'}
              navigateToPicture={navigateToPicture}
              allowClicks={allowClicks}
            />
          ) : null;
        })}
      </div>
      {pictures.length > (inverse ? 0 : 2) ? (
        <SinglePicture
          key={pictures[inverse ? 0 : 2].id}
          picture={pictures[inverse ? 0 : 2]}
          size={'big'}
          navigateToPicture={navigateToPicture}
          allowClicks={allowClicks}
        />
      ) : null}
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
  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();

  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const [filterDate, setFilterDate] = useState<number>(date);

  const rightResult = useGetPictures(
    {
      time_range_tag: { start: { gte: new Date(`${filterDate}-01-01`) } },
    },
    false,
    ['time_range_tag.start:asc'],
    true,
    50,
    'cache-and-network',
    PictureOverviewType.CUSTOM
  );

  const leftResult = useGetPictures(
    { time_range_tag: { start: { lt: new Date(`${filterDate}-01-01`) } } },
    false,
    ['time_range_tag.start:desc'],
    true,
    3,
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

  useEffect(() => {
    if (leftResult.loading || rightResult.loading) {
      return;
    }
    const lowerBorder = pictures.length
      ? new Date(pictures[0]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    const upperBorder = pictures.length
      ? new Date(pictures[pictures.length - 1]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    if (!lowerBorder || !upperBorder || !(lowerBorder <= date && date <= upperBorder)) {
      setFilterDate(date);
    } else {
      const field = Math.floor((scrollBarRef?.scrollLeft ?? 0) / 270);
      const index = field * 3 + ((leftPictures?.length ?? 0) % 3);
      const selectedPicture = pictures[index];
      if (new Date(selectedPicture.time_range_tag?.start as Date).getFullYear() !== date) {
        if (!scrollBarRef) {
          return;
        }
        const lastIndex = pictures.findLastIndex(
          value =>
            value.time_range_tag?.start &&
            new Date(value.time_range_tag?.start as Date).getFullYear() < date
        );
        const lastField = Math.floor(lastIndex / 3) + (leftPictures?.length ?? 0 ? 1 : 0);
        scrollBarRef.scrollLeft = lastField * 270;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const fetchMoreOnScrollRight = useCallback(
    (count: number) => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

  const content = useMemo(() => {
    return (
      <div className='flex gap-[10px]'>
        <div className='flex flex-row-reverse gap-[10px] py-[8px]'>
          {leftPictures?.map((_, index) => {
            if (!(index % 3)) {
              return (
                <PictureWidget
                  key={index}
                  variant={index % 6 ? 'var-2' : 'var-1'}
                  pictures={leftPictures.slice(index, index + 3)}
                  allowClicks={allowClicks}
                  inverse={true}
                  navigateToPicture={navigateToPicture}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className='flex gap-[10px] py-[8px]'>
          {rightPictures?.map((_, index) => {
            if (!(index % 3)) {
              return (
                <PictureWidget
                  key={index}
                  variant={index % 6 ? 'var-1' : 'var-2'}
                  pictures={rightPictures.slice(index, index + 3)}
                  allowClicks={allowClicks}
                  navigateToPicture={navigateToPicture}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  }, [allowClicks, leftPictures, navigateToPicture, rightPictures]);

  useEffect(() => {
    if (!scrollBarRef || leftResult.loading) {
      return;
    }
    if ((leftPictures?.length ?? 0) <= 3) {
      scrollBarRef.scrollLeft = 270;
    } else {
      const oldLength = Math.ceil(pictureLength.current / 3);
      const newLength = Math.ceil((leftPictures?.length ?? 0) / 3);
      console.log(oldLength, newLength);
      scrollBarRef.scrollLeft += (newLength - oldLength) * 270;
    }
    pictureLength.current = leftPictures?.length ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPictures?.length, leftResult.loading]);

  const updateCurrentValue = useCallback(() => {
    const field = Math.floor((scrollBarRef?.scrollLeft ?? 0) / 270);
    const index = field * 3 + ((leftPictures?.length ?? 0) % 3);
    const selectedPicture = pictures[index];
    const year = new Date(selectedPicture.time_range_tag?.start as Date).getFullYear();
    if (leftResult.loading || rightResult.loading) {
      return;
    }
    const lowerBorder = pictures.length
      ? new Date(pictures[0]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    const upperBorder = pictures.length
      ? new Date(pictures[pictures.length - 1]?.time_range_tag?.start as Date).getFullYear()
      : undefined;
    if (!lowerBorder || !upperBorder || (lowerBorder <= year && year <= upperBorder)) {
      setDate(year);
    }
  }, [
    leftPictures?.length,
    leftResult.loading,
    pictures,
    rightResult.loading,
    scrollBarRef?.scrollLeft,
    setDate,
  ]);

  const updateOnScrollX = useMemo(() => throttle(updateCurrentValue, 500), [updateCurrentValue]);

  return (
    <>
      <div className='relative'>
        <ScrollBar
          containerRef={ref => {
            setScrollBarRef(ref);
          }}
          onScrollX={updateOnScrollX}
          onXReachStart={ref => {
            if (!leftResult.loading) {
              fetchMoreOnScrollLeft(99);
            }
          }}
          onXReachEnd={ref => {
            if (!rightResult.loading) {
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
