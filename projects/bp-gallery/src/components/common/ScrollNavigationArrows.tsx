import { FastForward, FastRewind } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { MobileContext } from '../provider/MobileProvider';

const ScrollNavigationArrows = ({
  onClickLeft,
  onClickRight,
  isVisibleLeft = true,
  isVisibleRight = true,
  showOnMobile = true,
}: {
  onClickLeft: () => void;
  onClickRight: () => void;
  isVisibleLeft?: boolean;
  isVisibleRight?: boolean;
  showOnMobile?: boolean;
}) => {
  const { isMobile } = useContext(MobileContext);

  if (!isMobile || showOnMobile) {
    return (
      <div>
        <div
          className={`absolute top-0 left-0 h-full flex ${isVisibleLeft ? 'visible' : 'hidden'}`}
        >
          <IconButton
            className='!bg-[#7e241d] !text-white !my-auto !shadow-xl'
            onClick={onClickLeft}
          >
            <FastRewind className='icon' />
          </IconButton>
        </div>
        <div
          className={`absolute top-0 right-0 h-full flex ${isVisibleRight ? 'visible' : 'hidden'}`}
        >
          <IconButton
            className='!bg-[#7e241d] !text-white !my-auto !shadow-xl'
            onClick={onClickRight}
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
