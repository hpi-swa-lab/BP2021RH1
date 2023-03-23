import { ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler } from 'react';
import './PrimaryButton.scss';

const PrimaryButton = ({
  text,
  onClickFn,
  isShowMore,
}: {
  text: string;
  onClickFn: MouseEventHandler;
  isShowMore?: boolean;
}) => {
  return (
    <Button
      variant='contained'
      onClick={onClickFn}
      className='primary-button'
      endIcon={isShowMore && <ArrowForwardIos />}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
