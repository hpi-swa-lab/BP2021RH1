import { Event } from '@mui/icons-material';
import { Portal } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { root } from '../../../helpers/app-helpers';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import useGetPictures from '../../../hooks/get-pictures.hook';
import {
  FlatPicture,
  FlatTimeRangeTag,
  PictureOverviewType,
} from '../../../types/additionalFlatTypes';
import PictureView from '../../views/picture/PictureView';
import DateRangeSelectionField from '../../views/picture/sidebar/picture-info/DateRangeSelectionField';
import PictureInfoField from '../../views/picture/sidebar/picture-info/PictureInfoField';
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
  queryParams,
  sortBy,
  type = PictureOverviewType.CUSTOM,
  allowClicks,
}: {
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  sortBy?: string[];
  type?: PictureOverviewType;
  allowClicks?: boolean;
}) => {
  const [date, setDate] = useState<FlatTimeRangeTag>();

  const rightResult = useGetPictures(
    {
      time_range_tag: { start: { gte: date?.start } },
    },
    false,
    ['time_range_tag.start:asc'],
    true,
    50,
    'cache-and-network',
    type
  );

  const leftResult = useGetPictures(
    { time_range_tag: { start: { lt: date?.start } } },
    false,
    ['time_range_tag.start:desc'],
    true,
    50,
    'cache-and-network',
    type
  );

  const [pictureLength, setPictureLength] = useState<number>(0);

  const rightPictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(
    rightResult.data
  )?.pictures;
  const leftPictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(
    leftResult.data
  )?.pictures;

  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(true);
  const [lastScrollPos, setLastScrollPos] = useState<number>(0);

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

  useEffect(() => {
    if ((rightPictures?.length ?? 0) < 50) {
      fetchMoreOnScrollRight(50);
    }
  }, [fetchMoreOnScrollRight, rightPictures?.length]);

  useEffect(() => {
    if (scrollBarRef) {
      scrollBarRef.scroll({
        top: 0,
        left:
          scrollBarRef.scrollLeft +
          270 *
            (Math.ceil(((leftPictures?.length ?? 0) - pictureLength) / 3.0) -
              (pictureLength % 3 ? 1 : 0)),
        behavior: 'auto',
      });
      setPictureLength(leftPictures?.length ?? 0);
      setLastScrollPos(scrollBarRef.scrollLeft);
    }
  }, [leftPictures?.length, pictureLength, scrollBarRef]);

  const pictures = useMemo(() => {
    return [...[...(leftPictures ?? [])].reverse(), ...(rightPictures ?? [])];
  }, [leftPictures, rightPictures]);

  const [currentValue, setCurrentValue] = useState<FlatTimeRangeTag>();
  const [field, setField] = useState<number>(0);

  const updateField = useCallback(() => {
    const tempField = Math.floor((scrollBarRef?.scrollLeft ?? 0) / 270);
    if (tempField !== field) {
      setField(tempField);
    }
  }, [field, scrollBarRef?.scrollLeft]);

  useEffect(() => {
    const selectedPicture =
      pictures.length > field * 3 + ((leftPictures?.length ?? 0) % 3) - 1
        ? pictures[field * 3 + ((leftPictures?.length ?? 0) % 3) - 1]
        : undefined;
    if (currentValue !== selectedPicture?.time_range_tag) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setCurrentValue(selectedPicture?.time_range_tag);
    }
  }, [pictures, field, leftPictures?.length, currentValue]);

  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);
  const [transitioning, setTransitioning] = useState<boolean>(false);

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

  return (
    <>
      <PictureInfoField title={t('pictureFields.time')} icon={<Event />} type='date'>
        <DateRangeSelectionField
          timeRangeTag={currentValue}
          onChange={range => {
            setDate(range);
            setPictureLength(0);
          }}
          onTouch={() => {}}
          onResetTouch={() => {}}
          freeUse={true}
        />
      </PictureInfoField>
      <div className='relative'>
        <ScrollBar
          containerRef={ref => {
            setScrollBarRef(ref);
          }}
          onScrollX={ref => {
            setShowLeftButton(true);
            setShowRightButton(true);
            updateField();
          }}
          onXReachStart={ref => {
            setShowLeftButton(false);
            if (ref.scrollLeft !== lastScrollPos) {
              fetchMoreOnScrollLeft(99);
              setLastScrollPos(ref.scrollLeft);
            }
          }}
          onXReachEnd={ref => {
            setShowRightButton(false);
            if (ref.scrollLeft !== lastScrollPos) {
              fetchMoreOnScrollRight(99);
              setLastScrollPos(ref.scrollLeft);
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
