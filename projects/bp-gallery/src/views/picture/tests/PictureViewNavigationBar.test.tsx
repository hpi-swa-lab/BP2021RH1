import { render, screen } from '@testing-library/react';
import React from 'react';
import PictureViewNavigationBar, { FocusArea } from '../components/PictureViewNavigationBar';

describe('PictureViewNavigationBar', () => {
  const setFocusedAreaMock = jest.fn();

  it('should display focus buttons', async () => {
    render(
      <PictureViewNavigationBar
        focusedArea={FocusArea.PICTURE}
        setFocusedArea={setFocusedAreaMock}
        containerRef={{ current: null }}
      />
    );

    const pictureButton = screen.getByText('common.picture');
    expect(pictureButton).toBeInTheDocument();

    const infoButton = screen.getByText('common.information');
    expect(infoButton).toBeInTheDocument();

    const commentsButton = screen.getByText('common.comments');
    expect(commentsButton).toBeInTheDocument();
  });

  it('should call focusCallback when picture button is clicked', async () => {
    render(
      <PictureViewNavigationBar
        focusedArea={FocusArea.PICTURE}
        setFocusedArea={setFocusedAreaMock}
        containerRef={{ current: null }}
      />
    );

    const pictureButton = screen.getByText('common.picture');

    pictureButton.parentElement?.click();
    expect(setFocusedAreaMock).toHaveBeenCalledWith(FocusArea.PICTURE);
  });

  it('should call focusCallback when info button is clicked', async () => {
    render(
      <PictureViewNavigationBar
        focusedArea={FocusArea.PICTURE}
        setFocusedArea={setFocusedAreaMock}
        containerRef={{ current: null }}
      />
    );

    const infoButton = screen.getByText('common.information');

    infoButton.parentElement?.click();
    expect(setFocusedAreaMock).toHaveBeenCalledWith(FocusArea.DETAILS);
  });

  it('should call focusCallback when comments button is clicked', async () => {
    render(
      <PictureViewNavigationBar
        focusedArea={FocusArea.PICTURE}
        setFocusedArea={setFocusedAreaMock}
        containerRef={{ current: null }}
      />
    );

    const commentsButton = screen.getByText('common.comments');

    commentsButton.parentElement?.click();
    expect(setFocusedAreaMock).toHaveBeenCalledWith(FocusArea.COMMENTS);
  });
});
