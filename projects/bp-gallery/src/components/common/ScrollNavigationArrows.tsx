import { FastForward, FastRewind } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { MobileContext } from '../provider/MobileProvider';

const ScrollNavigationArrows = ({
  onClickLeft,
  onClickRight,
  onLongPressLeft,
  onLongPressRight,
  longPressTimeoutLeft = 1000,
  longPressTimeoutRight = 1000,
  isVisibleLeft = true,
  isVisibleRight = true,
  allowLongPressLeft = true,
  allowLongPressRight = true,
  showOnMobile = true,
}: {
  onClickLeft: () => void;
  onClickRight: () => void;
  onLongPressLeft?: () => void;
  onLongPressRight?: () => void;
  longPressTimeoutLeft?: number;
  longPressTimeoutRight?: number;
  isVisibleLeft?: boolean;
  isVisibleRight?: boolean;
  allowLongPressLeft?: boolean;
  allowLongPressRight?: boolean;
  showOnMobile?: boolean;
}) => {
  const { isMobile } = useContext(MobileContext);
  const [isPressedLeft, setPressedLeft] = useState<boolean>(false);
  const [isPressedRight, setPressedRight] = useState<boolean>(false);
  const disallowClickLeft = useRef<boolean>(false);
  const disallowClickRight = useRef<boolean>(false);

  const leftPressTimeout = useRef<NodeJS.Timeout>();
  const rightPressTimeout = useRef<NodeJS.Timeout>();

  const onPressLeft = (e: any) => {
    if (e?.type === 'click') {
      if (!disallowClickLeft.current) {
        onClickLeft();
      } else {
        disallowClickLeft.current = false;
      }
    } else {
      if (!e) {
        // e is undefined if this function is called via timeout and therefore is accessed via a long press instead of a click
        disallowClickLeft.current = true;
      }
      if (disallowClickLeft.current) {
        onLongPressLeft ? onLongPressLeft() : onClickLeft();
      }
      if (allowLongPressLeft) {
        leftPressTimeout.current = setTimeout(onPressLeft, longPressTimeoutLeft);
      }
    }
  };

  const onPressRight = (e: any) => {
    if (e?.type === 'click') {
      if (!disallowClickRight.current) {
        onClickRight();
      } else {
        disallowClickRight.current = false;
      }
    } else {
      if (!e) {
        // e is undefined if this function is called via timeout and therefore is accessed via a long press instead of a click
        disallowClickRight.current = true;
      }
      if (disallowClickRight.current) {
        onLongPressRight ? onLongPressRight() : onClickRight();
      }
      if (allowLongPressRight) {
        rightPressTimeout.current = setTimeout(onPressRight, longPressTimeoutRight);
      }
    }
  };

  useEffect(() => {
    if (!isPressedLeft) {
      clearTimeout(leftPressTimeout.current);
    }
  }, [isPressedLeft]);

  useEffect(() => {
    if (!isPressedRight) {
      clearTimeout(rightPressTimeout.current);
    }
  }, [isPressedRight]);

  if (!isMobile || showOnMobile) {
    return (
      <div>
        <div
          className={`absolute top-0 left-0 h-full flex ${isVisibleLeft ? 'visible' : 'hidden'}`}
        >
          <IconButton
            className='!bg-[#7e241d] !text-white !my-auto !shadow-xl !ml-1'
            onClick={e => {
              onPressLeft(e);
            }}
            onMouseDown={e => {
              setPressedLeft(true);
              onPressLeft(e);
            }}
            onTouchStart={e => {
              setPressedLeft(true);
              onPressLeft(e);
            }}
            onMouseUp={() => {
              setPressedLeft(false);
            }}
            onMouseLeave={() => {
              setPressedLeft(false);
            }}
            onTouchEnd={() => {
              setPressedLeft(false);
            }}
          >
            <FastRewind className='icon' />
          </IconButton>
        </div>
        <div
          className={`absolute top-0 right-0 h-full flex ${isVisibleRight ? 'visible' : 'hidden'}`}
        >
          <IconButton
            className='!bg-[#7e241d] !text-white !my-auto !shadow-xl !mr-1'
            onClick={e => {
              onPressRight(e);
            }}
            onMouseDown={e => {
              setPressedRight(true);
              onPressRight(e);
            }}
            onTouchStart={e => {
              setPressedRight(true);
              onPressRight(e);
            }}
            onMouseUp={() => {
              setPressedRight(false);
            }}
            onMouseLeave={() => {
              setPressedRight(false);
            }}
            onTouchEnd={() => {
              setPressedRight(false);
            }}
          >
            <FastForward className='icon' />
          </IconButton>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ScrollNavigationArrows;
