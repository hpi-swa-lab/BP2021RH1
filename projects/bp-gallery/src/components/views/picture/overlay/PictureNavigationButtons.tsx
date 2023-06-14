import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { PictureViewContext } from '../PictureView';
import { useNoDistractionModeStyle } from '../helpers/no-distraction-mode-style';

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

  const noDistractionModeStyle = useNoDistractionModeStyle();

  return (
    <div className={`picture-navigation-buttons ${noDistractionModeStyle}`}>
      <IconButton
        style={{ visibility: hasPrevious ? 'visible' : 'hidden' }}
        onClick={
          navigatePicture ? () => navigatePicture(PictureNavigationTarget.PREVIOUS) : undefined
        }
        size='large'
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        style={{ visibility: hasNext ? 'visible' : 'hidden' }}
        onClick={navigatePicture ? () => navigatePicture(PictureNavigationTarget.NEXT) : undefined}
        size='large'
      >
        <ChevronRight />
      </IconButton>
    </div>
  );
};

export default PictureNavigationButtons;
