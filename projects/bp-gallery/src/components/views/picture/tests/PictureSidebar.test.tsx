import { fireEvent, screen, waitFor } from '@testing-library/react';
import React, { ReactComponentElement } from 'react';
import { FlatPicture } from '../../../../types/additionalFlatTypes';
import { flattenQueryResponseData } from '../../../../graphql/queryUtils';
import PictureSidebar from '../sidebar/PictureSidebar';
import { CommentMocks, PictureMocks } from './mocks';
import { wrapInPictureContextMocks } from './pictureTestUtils';
import { renderWithAPIMocks } from '../../../../testUtils';
import { vi } from 'vitest';

const CommentsContainerMock = vi.fn();
const CommentsContainerMockComponent = (props: any) => {
  CommentsContainerMock(props);
  return <div>CommentsContainerMock</div>;
};
vi.doMock('../sidebar/comments/CommentsContainer', () => ({
  default: CommentsContainerMockComponent,
}));

const PictureInfoMock = vi.fn();
const PictureInfoMockComponent = (props: any) => {
  PictureInfoMock(props);
  return <div>PictureInfoMock</div>;
};
vi.doMock('../sidebar/picture-info/PictureInfo', () => ({ default: PictureInfoMockComponent }));

const renderWithAPIMocksAndPictureContextMocks = (component: ReactComponentElement<any>) => {
  return renderWithAPIMocks(wrapInPictureContextMocks(component));
};

describe('PictureSidebar', () => {
  it('should be able to open and close', async () => {
    const component = renderWithAPIMocksAndPictureContextMocks(
      <PictureSidebar picture={flattenQueryResponseData(PictureMocks) as FlatPicture} />
    );
    const { container } = component;
    const openCloseButton = await component.findByRole('button');
    expect(openCloseButton).toBeInTheDocument();
    expect(container.querySelector('.picture-sidebar')?.className).toContain('closed');
    fireEvent(
      openCloseButton,
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
    renderWithAPIMocksAndPictureContextMocks(
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
