import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithPictureContextMocks } from './pictureTestUtils';
import PictureNavigationButtons, {
  PictureNavigationTarget,
} from '../overlay/PictureNavigationButtons';

describe('PictureViewNavigationButtons', () => {
  it('should show next button if there is a next picture', async () => {
    renderWithPictureContextMocks(<PictureNavigationButtons />, {
      hasNext: true,
    });

    const nextButton = screen.getByText('chevron_right');
    expect(nextButton).toBeInTheDocument();
    expect(nextButton.parentElement?.style.visibility).toBe('visible');
  });

  it('should not show next button if there is no next picture', async () => {
    renderWithPictureContextMocks(<PictureNavigationButtons />, {
      hasNext: false,
    });

    const nextButton = screen.getByText('chevron_right');
    expect(nextButton).toBeInTheDocument();
    expect(nextButton.parentElement?.style.visibility).toBe('hidden');
  });

  it('should show previous button if there is a previous picture', async () => {
    renderWithPictureContextMocks(<PictureNavigationButtons />, {
      hasPrevious: true,
    });

    const previousButton = screen.getByText('chevron_left');
    expect(previousButton).toBeInTheDocument();
    expect(previousButton.parentElement?.style.visibility).toBe('visible');
  });

  it('should not show previous button if there is no previous picture', async () => {
    renderWithPictureContextMocks(<PictureNavigationButtons />, {
      hasPrevious: false,
    });

    const previousButton = screen.getByText('chevron_left');
    expect(previousButton).toBeInTheDocument();
    expect(previousButton.parentElement?.style.visibility).toBe('hidden');
  });

  it('should call navigatePicture when buttons are clicked', async () => {
    const navigatePictureMock = jest.fn();
    renderWithPictureContextMocks(<PictureNavigationButtons />, {
      hasPrevious: true,
      hasNext: true,
      navigatePicture: navigatePictureMock,
    });

    const previousButton = screen.getByText('chevron_left');
    previousButton.parentElement?.click();

    expect(navigatePictureMock).toHaveBeenCalledWith(PictureNavigationTarget.PREVIOUS);

    const nextButton = screen.getByText('chevron_right');
    nextButton.parentElement?.click();

    expect(navigatePictureMock).toHaveBeenCalledWith(PictureNavigationTarget.NEXT);
  });
});
