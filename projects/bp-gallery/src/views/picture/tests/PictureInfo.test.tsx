import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import PictureInfo from '../components/PictureInfo';
import { FocusArea } from '../components/PictureViewNavigationBar';
import { CommentMocks, DescriptionMocks, PictureMocks } from './mocks';
import { renderWithPictureContextMocks } from './pictureTestUtils';

const CommentsContainerMock = jest.fn();
const CommentsContainerMockComponent = (props: any) => {
  CommentsContainerMock(props);
  return <div>CommentsContainerMock</div>;
};
jest.mock('../components/comments/CommentsContainer', () => CommentsContainerMockComponent);

const PictureViewNavigationBarMock = jest.fn();
const PictureViewNavigationBarMockComponent = (props: any) => {
  PictureViewNavigationBarMock(props);
  return <div>PictureViewNavigationBarMock</div>;
};
jest.mock('../components/PictureViewNavigationBar', () => ({
  __esModule: true,
  default: PictureViewNavigationBarMockComponent,
  FocusArea: {
    PICTURE: 0,
    DETAILS: 1,
    COMMENTS: 2,
  },
}));

const PictureDetailsMock = jest.fn();
const PictureDetailsMockComponent = (props: any) => {
  PictureDetailsMock(props);
  return <div>PictureDetailsMock</div>;
};
jest.mock('../components/PictureDetails', () => PictureDetailsMockComponent);

const calculateHeightMock = jest.fn();

describe('PictureInfo', () => {
  it('should display open-close-button', () => {
    const { container } = renderWithPictureContextMocks(
      <PictureInfo calculateHeight={calculateHeightMock} picture={PictureMocks} pictureId={'1'} />
    );
    const openCloseButtons = container.getElementsByClassName('open-close-button');
    expect(openCloseButtons.length).toBe(1);
    expect((openCloseButtons[0] as HTMLElement).innerHTML).toContain('chevron_right');
  });

  it('should be able to open and close', async () => {
    const { container } = renderWithPictureContextMocks(
      <PictureInfo calculateHeight={calculateHeightMock} picture={PictureMocks} pictureId={'1'} />
    );
    const openCloseButton = container.getElementsByClassName('open-close-button')[0];
    expect(container.querySelector('.picture-info-container')?.className).toContain('closed');
    fireEvent(
      openCloseButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    await waitFor(async () => {
      expect(container.querySelector('.picture-info-container')?.className).not.toContain('closed');
    });
  });

  it('should render the images time range tag', async () => {
    renderWithPictureContextMocks(
      <PictureInfo calculateHeight={calculateHeightMock} picture={PictureMocks} pictureId={'1'} />
    );

    const timeRangeTags = screen.getByText('10.10.1955 - 12.10.1955');
    expect(timeRangeTags).toBeInTheDocument();
  });

  it('should render the picture details', async () => {
    renderWithPictureContextMocks(
      <PictureInfo calculateHeight={calculateHeightMock} picture={PictureMocks} pictureId={'1'} />
    );

    const pictureDetails = screen.getByText('PictureDetailsMock');
    expect(pictureDetails).toBeInTheDocument();

    expect(PictureDetailsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        descriptions: DescriptionMocks,
      })
    );
  });

  it('should render the comments container', async () => {
    renderWithPictureContextMocks(
      <PictureInfo calculateHeight={calculateHeightMock} picture={PictureMocks} pictureId={'1'} />
    );

    const commentsContainer = screen.getByText('CommentsContainerMock');
    expect(commentsContainer).toBeInTheDocument();

    expect(CommentsContainerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        comments: CommentMocks,
      })
    );
  });

  it('should render the picture view navigation bar', async () => {
    renderWithPictureContextMocks(
      <PictureInfo calculateHeight={calculateHeightMock} picture={PictureMocks} pictureId={'1'} />
    );

    const navigationBar = screen.getByText('PictureViewNavigationBarMock');
    expect(navigationBar).toBeInTheDocument();

    expect(PictureViewNavigationBarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        focusedArea: FocusArea.PICTURE,
      })
    );
  });
});
