import { ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';
import './PrimaryButton.scss';

const PrimaryButton = ({
  children,
  onClick,
  withRightArrow,
}: PropsWithChildren<{
  onClick: MouseEventHandler;
  withRightArrow?: boolean;
}>) => {
  return (
    <Button
      variant='contained'
      onClick={onClick}
      className='primary-button'
      endIcon={withRightArrow && <ArrowForwardIos />}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
