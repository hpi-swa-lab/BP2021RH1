import { ArrowDownward } from '@mui/icons-material';
import { debounce } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import ScrollBar from 'react-perfect-scrollbar';

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
  const [scrollBarRef, setScrollBarRef] = useState<HTMLElement>();

  useEffect(() => {
    if (scrollBarRef) {
      scrollBarRef.scrollLeft = (date - start) * 80 + 40 + 21;
    }
  }, [date, scrollBarRef, start]);

  const updateDate = useCallback(() => {
    if (scrollBarRef) {
      const year = Math.floor((scrollBarRef.scrollLeft + 61) / 80) + start - 1;
      setDate(year);
    }
  }, [scrollBarRef, setDate, start]);

  const listItems = [];
  for (let i = start; i < end; i++) {
    listItems.push(
      <li
        key={i}
        className='inline cursor-pointer pl-[20px] pr-[60px] pt-[40px] pb-[20px]'
        onClick={() => {
          if (!scrollBarRef) return;
          scrollBarRef.scroll({ left: (i - start) * 80 + 40 + 21, behavior: 'auto' });
        }}
      >
        <div className='relative inline w-full'>
          <hr className='absolute left-0 top-0 h-[16px]' />
          <span className='absolute -left-[18px] -top-4'>{i}</span>
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
        <ScrollBar
          containerRef={ref => {
            setScrollBarRef(ref);
          }}
          onScrollX={updateOnScrollX}
        >
          <div className='flex'>
            <ul className='py-[16px] px-[50%] mt-0'>{listItems}</ul>
          </div>
        </ScrollBar>
      </div>
    </div>
  );
};

export default PictureTimeline;
