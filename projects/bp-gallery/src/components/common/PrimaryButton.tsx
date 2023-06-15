import { ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';
import './PrimaryButton.scss';

const PrimaryButton = ({
  children,
  onClickFn,
  isShowMore,
  type,
  className,
}: PropsWithChildren<{
  onClickFn?: MouseEventHandler;
  isShowMore?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}>) => {
  return (
    <Button
      variant='contained'
      onClick={onClickFn}
      className={`primary-button ${className ?? ''}`}
      endIcon={isShowMore && <ArrowForwardIos />}
      type={type}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
