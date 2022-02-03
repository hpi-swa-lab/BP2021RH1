import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { flattenQueryResponseData } from '../../../graphql/queryUtils';
import PictureInfo from '../components/PictureInfo';
import { CommentMocks, DescriptionMocks, PictureMocks } from './mocks';
import { renderWithAPIMocksAndMockedPictureContext } from './pictureTestUtils';

const CommentsContainerMock = jest.fn();
const CommentsContainerMockComponent = (props: any) => {
  CommentsContainerMock(props);
  return <div>CommentsContainerMock</div>;
};
jest.mock('../components/comments/CommentsContainer', () => CommentsContainerMockComponent);

const PictureDetailsMock = jest.fn();
const PictureDetailsMockComponent = (props: any) => {
  PictureDetailsMock(props);
  return <div>PictureDetailsMock</div>;
};
jest.mock('../components/PictureDetails', () => PictureDetailsMockComponent);

describe('PictureInfo', () => {
  it('should be able to open and close', async () => {
    const { container } = renderWithAPIMocksAndMockedPictureContext(
      <PictureInfo picture={flattenQueryResponseData(PictureMocks)} pictureId={'1'} />
    );
    const openCloseButton = container.querySelector('.quick-access-buttons button');
    expect(openCloseButton).toBeInTheDocument();
    expect(container.querySelector('.picture-info-container')?.className).toContain('closed');
    fireEvent(
      openCloseButton!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    await waitFor(async () => {
      expect(container.querySelector('.picture-info-container')?.className).not.toContain('closed');
    });
  });

  it('should render the pictures time range tag', async () => {
    renderWithAPIMocksAndMockedPictureContext(
      <PictureInfo picture={flattenQueryResponseData(PictureMocks)} pictureId={'1'} />
    );

    const timeRangeTags = screen.getByText('10.10.1955 - 12.10.1955');
    expect(timeRangeTags).toBeInTheDocument();
  });

  it('should render the picture details', async () => {
    renderWithAPIMocksAndMockedPictureContext(
      <PictureInfo picture={flattenQueryResponseData(PictureMocks)} pictureId={'1'} />
    );

    const pictureDetails = screen.getByText('PictureDetailsMock');
    expect(pictureDetails).toBeInTheDocument();

    expect(PictureDetailsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        descriptions: flattenQueryResponseData(DescriptionMocks),
      })
    );
  });

  it('should render the comments container', async () => {
    renderWithAPIMocksAndMockedPictureContext(
      <PictureInfo picture={flattenQueryResponseData(PictureMocks)} pictureId={'1'} />
    );

    const commentsContainer = screen.getByText('CommentsContainerMock');
    expect(commentsContainer).toBeInTheDocument();

    expect(CommentsContainerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        comments: flattenQueryResponseData(CommentMocks),
      })
    );
  });
});
