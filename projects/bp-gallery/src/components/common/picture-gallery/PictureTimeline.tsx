import { ArrowDropDown } from '@mui/icons-material';
import { debounce } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAnimate } from '../../../hooks/animate.hook';
import ScrollNavigationArrows from '../ScrollNavigationArrows';

// for future work
export const enum TimeStepType {
  DECADE = 'decade',
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
}

const TEXT_OVERFLOW_WIDTH = 20;

const PictureTimeline = ({
  start,
  end,
  type,
  date,
  setDate,
  singleElementWidth = 80,
}: {
  start: number;
  end: number;
  type: TimeStepType;
  date: number;
  setDate: Dispatch<SetStateAction<number>>;
  singleElementWidth?: number;
}) => {
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, scrollTo] = useAnimate(
    (date - start) * singleElementWidth + singleElementWidth / 2 + TEXT_OVERFLOW_WIDTH,
    0.06
  );

  useEffect(() => {
    if (scrollBarRef.current) {
      scrollBarRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollBarRef, scrollLeft]);

  const updateDate = useCallback(() => {
    if (scrollBarRef.current) {
      scrollTo(scrollBarRef.current.scrollLeft);
      const year =
        Math.floor(
          (scrollBarRef.current.scrollLeft + singleElementWidth / 2 + TEXT_OVERFLOW_WIDTH) /
            singleElementWidth
        ) +
        start -
        1;
      setDate(year);
    }
  }, [scrollTo, setDate, singleElementWidth, start]);

  const listItems = [];
  for (let year = start; year <= end; year++) {
    const isHighlighted = date === year || date === year - 1;
    listItems.push(
      <li
        key={year}
        className='inline cursor-pointer'
        onClick={() => {
          setDate(year);
        }}
        style={{
          padding: `40px ${
            singleElementWidth - TEXT_OVERFLOW_WIDTH
          }px 20px ${TEXT_OVERFLOW_WIDTH}px`,
        }}
      >
        <div className='relative inline w-full bottom-0'>
          <hr
            className={`absolute left-0 ${isHighlighted ? '-top-1 h-[20px]' : 'top-0 h-[16px]'}`}
          />
          <span
            className={`absolute -left-[18px] ${
              isHighlighted ? '-top-5 text-black' : '-top-4 text-slate-500'
            } select-none`}
          >
            {year}
          </span>
        </div>
      </li>
    );
  }

  const updateOnScrollX = useMemo(() => debounce(updateDate, 500), [updateDate]);

  return (
    <div>
      <div className='flex'>
        <ArrowDropDown className='mx-auto scale-[1.75]' />
      </div>
      <div className='relative mb-2'>
        <div className='overflow-x-scroll z-0' ref={scrollBarRef} onScroll={updateOnScrollX}>
          <div className='flex pb-2'>
            <ul className='py-[16px] px-[50%] my-0 whitespace-nowrap'>{listItems}</ul>
          </div>
        </div>
        <ScrollNavigationArrows
          onClickLeft={() => {
            setDate(prev => Math.max(start, prev - 1));
          }}
          onClickRight={() => {
            setDate(prev => Math.min(end, prev + 1));
          }}
          longPressTimeoutLeft={500}
          longPressTimeoutRight={500}
          isVisibleLeft={date > start}
          isVisibleRight={date < end}
          showOnMobile={false}
        />
      </div>
    </div>
  );
};

export default PictureTimeline;
