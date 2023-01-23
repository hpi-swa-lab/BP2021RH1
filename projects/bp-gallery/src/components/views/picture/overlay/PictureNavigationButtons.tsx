import { Icon, IconButton } from 'mui';
import React, { useContext, useEffect } from 'react';
import { PictureViewContext } from '../PictureView';

export enum PictureNavigationTarget {
  NEXT,
  PREVIOUS,
}

const PictureNavigationButtons = () => {
  const { navigatePicture, hasNext, hasPrevious } = useContext(PictureViewContext);

  useEffect(() => {
    const navigateKeyboardAction = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && hasNext && navigatePicture) {
        navigatePicture(PictureNavigationTarget.NEXT);
      } else if (event.key === 'ArrowLeft' && hasPrevious && navigatePicture) {
        navigatePicture(PictureNavigationTarget.PREVIOUS);
      }
    };
    window.addEventListener('keyup', navigateKeyboardAction);
    return () => {
      window.removeEventListener('keyup', navigateKeyboardAction);
    };
  }, [hasNext, hasPrevious, navigatePicture]);

  return (
    <div className='picture-navigation-buttons'>
      <IconButton
        style={{ visibility: hasPrevious ? 'visible' : 'hidden' }}
        onClick={
          navigatePicture ? () => navigatePicture(PictureNavigationTarget.PREVIOUS) : undefined
        }
        size='large'
      >
        <Icon>chevron_left</Icon>
      </IconButton>
      <IconButton
        style={{ visibility: hasNext ? 'visible' : 'hidden' }}
        onClick={navigatePicture ? () => navigatePicture(PictureNavigationTarget.NEXT) : undefined}
        size='large'
      >
        <Icon>chevron_right</Icon>
      </IconButton>
    </div>
  );
};

export default PictureNavigationButtons;
