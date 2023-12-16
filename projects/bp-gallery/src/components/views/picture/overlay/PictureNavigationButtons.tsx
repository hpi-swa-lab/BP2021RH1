import { ChevronLeft, ChevronRight, Filter } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { PictureViewContext } from '../PictureView';
import { useNoDistractionModeStyle } from '../helpers/no-distraction-mode-style';

export enum PictureNavigationTarget {
  NEXT,
  PREVIOUS,
  NEXT_IN_SEQUENCE,
  PREVIOUS_IN_SEQUENCE,
}

const PictureNavigationButtons = () => {
  const { navigatePicture, hasNext, hasPrevious, hasNextInSequence, hasPreviousInSequence } =
    useContext(PictureViewContext);

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
    <div className={`picture-navigation-buttons ${noDistractionModeStyle} relative`}>
      <IconButton
        style={{ visibility: hasPrevious ? 'visible' : 'hidden' }}
        onClick={
          navigatePicture ? () => navigatePicture(PictureNavigationTarget.PREVIOUS) : undefined
        }
        size='large'
        data-testid='previous'
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        style={{ visibility: hasNext ? 'visible' : 'hidden' }}
        onClick={navigatePicture ? () => navigatePicture(PictureNavigationTarget.NEXT) : undefined}
        size='large'
        data-testid='next'
      >
        <ChevronRight />
      </IconButton>
      <div className='absolute w-full top-1/2 mt-10 flex flex-row justify-between'>
        <IconButton
          style={{ visibility: hasPreviousInSequence ? 'visible' : 'hidden' }}
          onClick={
            navigatePicture
              ? () => navigatePicture(PictureNavigationTarget.PREVIOUS_IN_SEQUENCE)
              : undefined
          }
          size='large'
          data-testid='previous-in-sequence'
        >
          <ChevronLeft />
          <Filter />
        </IconButton>
        <IconButton
          style={{ visibility: hasNextInSequence ? 'visible' : 'hidden' }}
          onClick={
            navigatePicture
              ? () => navigatePicture(PictureNavigationTarget.NEXT_IN_SEQUENCE)
              : undefined
          }
          size='large'
          data-testid='next-in-sequence'
        >
          <Filter />
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  );
};

export default PictureNavigationButtons;
