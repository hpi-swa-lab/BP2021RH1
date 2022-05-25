import { screen } from '@testing-library/react';
import React from 'react';
import PictureViewNavigationBar from '../overlay/PictureViewNavigationBar';
import { renderWithPictureContextMocks } from './pictureTestUtils';

const setSideBarOpenMock = jest.fn();

describe('PictureViewNavigationBar', () => {
  it('should display the open/close button', async () => {
    const { container } = renderWithPictureContextMocks(<PictureViewNavigationBar />, {
      setSideBarOpen: setSideBarOpenMock,
      sideBarOpen: true,
    });

    const button = container.getElementsByTagName('button')[0];

    expect(button).toBeInTheDocument();
  });

  it('should open the sidebar when the button is clicked', async () => {
    const { container } = renderWithPictureContextMocks(<PictureViewNavigationBar />, {
      setSideBarOpen: setSideBarOpenMock,
      sideBarOpen: true,
    });

    const button = container.getElementsByTagName('button')[0];
    button.click();
    expect(setSideBarOpenMock).toHaveBeenCalledWith(false);
  });

  it('should show showPicture when Sidebar is open', async () => {
    renderWithPictureContextMocks(<PictureViewNavigationBar />, {
      setSideBarOpen: setSideBarOpenMock,
      sideBarOpen: true,
    });

    const button = screen.getByText('common.showPicture');
    expect(button).toBeInTheDocument();
  });

  it('should show showInfo when Sidebar is closed', async () => {
    renderWithPictureContextMocks(<PictureViewNavigationBar />, {
      setSideBarOpen: setSideBarOpenMock,
      sideBarOpen: false,
    });

    const button = screen.getByText('common.showInfo');
    expect(button).toBeInTheDocument();
  });
});
