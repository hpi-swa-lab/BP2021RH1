import { ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';
import './PrimaryButton.scss';

const PrimaryButton = ({
  children,
  onClick,
  withRightArrow,
  type,
  className,
}: PropsWithChildren<{
  onClick?: MouseEventHandler;
  withRightArrow?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}>) => {
  return (
    <Button
      variant='contained'
      onClick={onClick}
      className={`primary-button ${className ?? ''}`}
      endIcon={withRightArrow && <ArrowForwardIos />}
      type={type}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
