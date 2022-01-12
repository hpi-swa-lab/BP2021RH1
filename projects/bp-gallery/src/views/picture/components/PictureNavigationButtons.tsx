import { Icon, IconButton } from '@mui/material';
import React from 'react';

const PictureNavigationButtons = ({
  onNextPicture,
  onPreviousPicture,
}: {
  onNextPicture?: () => void;
  onPreviousPicture?: () => void;
}) => {
  return (
    <div className='picture-navigation-buttons'>
      <IconButton
        style={{ visibility: onPreviousPicture ? 'visible' : 'hidden' }}
        onClick={() => (onPreviousPicture ? onPreviousPicture() : null)}
        size='large'
      >
        <Icon>fast_rewind</Icon>
      </IconButton>
      <IconButton
        style={{ visibility: onNextPicture ? 'visible' : 'hidden' }}
        onClick={() => (onNextPicture ? onNextPicture() : null)}
        size='large'
      >
        <Icon>fast_forward</Icon>
      </IconButton>
    </div>
  );
};

export default PictureNavigationButtons;
