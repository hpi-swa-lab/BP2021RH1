import { ArrowDropDown } from '@mui/icons-material';
import { debounce } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAnimate } from '../../../hooks/animate.hook';

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
  for (let year = start; year < end; year++) {
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
        <div className='relative inline w-full'>
          <hr className='absolute left-0 top-0 h-[16px]' />
          <span className='absolute -left-[18px] -top-4 select-none'>{year}</span>
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
      <div className='relative'>
        <div className='overflow-scroll' ref={scrollBarRef} onScroll={updateOnScrollX}>
          <div className='flex'>
            <ul className='py-[16px] px-[50%] mt-0 whitespace-nowrap'>{listItems}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PictureTimeline;
