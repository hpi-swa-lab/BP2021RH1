import { ArrowDownward } from '@mui/icons-material';
import { debounce } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAnimate } from '../../../hooks/animate.hook';

export const enum TimeStepType {
  DECADE = 'decade',
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
}

const PictureTimeline = ({
  start,
  end,
  type,
  date,
  setDate,
}: {
  start: number;
  end: number;
  type: TimeStepType;
  date: number;
  setDate: Dispatch<SetStateAction<number>>;
}) => {
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, scrollTo] = useAnimate((date - start) * 80 + 40 + 21, 0.06);

  useEffect(() => {
    if (scrollBarRef.current) {
      scrollBarRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollBarRef, scrollLeft]);

  const updateDate = useCallback(() => {
    if (scrollBarRef.current) {
      scrollTo(scrollBarRef.current.scrollLeft);
      const year = Math.floor((scrollBarRef.current.scrollLeft + 61) / 80) + start - 1;
      setDate(year);
    }
  }, [scrollBarRef, scrollTo, setDate, start]);

  const listItems = [];
  for (let year = start; year < end; year++) {
    listItems.push(
      <li
        key={year}
        className='inline cursor-pointer pl-[20px] pr-[60px] pt-[40px] pb-[20px]'
        onClick={() => {
          setDate(year);
        }}
      >
        <div className='relative inline w-full'>
          <hr className='absolute left-0 top-0 h-[16px]' />
          <span className='absolute -left-[18px] -top-4'>{year}</span>
        </div>
      </li>
    );
  }

  const updateOnScrollX = useMemo(() => debounce(updateDate, 500), [updateDate]);

  return (
    <div>
      <div className='flex'>
        <ArrowDownward className='mx-auto' />
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
