import { ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';
import './PrimaryButton.scss';

const PrimaryButton = ({
  children,
  onClickFn,
  isShowMore,
}: PropsWithChildren<{
  onClickFn: MouseEventHandler;
  isShowMore?: boolean;
}>) => {
  return (
    <Button
      variant='contained'
      onClick={onClickFn}
      className='primary-button'
      endIcon={isShowMore && <ArrowForwardIos />}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
