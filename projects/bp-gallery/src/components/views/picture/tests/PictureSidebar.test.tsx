import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { FlatPicture } from '../../../../types/additionalFlatTypes';
import { flattenQueryResponseData } from '../../../../graphql/queryUtils';
import PictureSidebar from '../sidebar/PictureSidebar';
import { CommentMocks, PictureMocks } from './mocks';
import { renderWithPictureContextMocks } from './pictureTestUtils';

const CommentsContainerMock = jest.fn();
const CommentsContainerMockComponent = (props: any) => {
  CommentsContainerMock(props);
  return <div>CommentsContainerMock</div>;
};
jest.mock('../sidebar/comments/CommentsContainer', () => CommentsContainerMockComponent);

const PictureInfoMock = jest.fn();
const PictureInfoMockComponent = (props: any) => {
  PictureInfoMock(props);
  return <div>PictureInfoMock</div>;
};
jest.mock('../sidebar/picture-info/PictureInfo', () => PictureInfoMockComponent);

describe('PictureSidebar', () => {
  it('should be able to open and close', async () => {
    const { container } = renderWithPictureContextMocks(
      <PictureSidebar picture={flattenQueryResponseData(PictureMocks) as FlatPicture} />
    );
    const openCloseButton = container.querySelector('.quick-access-buttons button');
    expect(openCloseButton).toBeInTheDocument();
    expect(container.querySelector('.picture-sidebar')?.className).toContain('closed');
    fireEvent(
      openCloseButton!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    await waitFor(async () => {
      expect(container.querySelector('.picture-sidebar')?.className).not.toContain('closed');
    });
  });

  it('should render the comments container', async () => {
    renderWithPictureContextMocks(
      <PictureSidebar picture={flattenQueryResponseData(PictureMocks) as FlatPicture} />
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
