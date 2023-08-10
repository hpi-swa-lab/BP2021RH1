import { FastForward, FastRewind } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ScrollNavigationArrows = ({
  onClickLeft,
  onClickRight,
  isVisibleLeft = true,
  isVisibleRight = true,
}: {
  onClickLeft: () => void;
  onClickRight: () => void;
  isVisibleLeft?: boolean;
  isVisibleRight?: boolean;
}) => {
  return (
    <div>
      <div className={`absolute top-0 left-0 h-full flex ${isVisibleLeft ? 'visible' : 'hidden'}`}>
        <IconButton className='!bg-[#7e241d] !text-white !my-auto !shadow-xl' onClick={onClickLeft}>
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
};

export default ScrollNavigationArrows;
