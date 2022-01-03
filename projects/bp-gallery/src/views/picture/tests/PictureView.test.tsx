import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithAPIMocks } from '../../../testUtils';
import { asApiPath } from '../../../App';
import { CommentMocks, DescriptionMocks, GetInfoPictureDocumentMocks } from './mocks';
import PictureView from '../PictureView';

const PictureMock = jest.fn();
const PictureMockComponent = (props: any) => {
  PictureMock(props);
  return <div>PictureMock</div>;
};
jest.mock('../Picture', () => PictureMockComponent);

const PictureDetailsMock = jest.fn();
const PictureDetailsMockComponent = (props: any) => {
  PictureDetailsMock(props);
  return <div>PictureDetailsMock</div>;
};
jest.mock('../PictureDetails', () => PictureDetailsMockComponent);

const CommentsContainerMock = jest.fn();
const CommentsContainerMockComponent = (props: any) => {
  CommentsContainerMock(props);
  return <div>CommentsContainerMock</div>;
};
jest.mock('../comments/CommentsContainer', () => CommentsContainerMockComponent);

describe('PictureView in non-thumbnailMode', () => {
  it('should render the Picture component', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='1' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const pictureElement = screen.getByText('PictureMock');
      expect(pictureElement).toBeInTheDocument();

      expect(PictureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'test-image.jpg',
        })
      );
    });
  });

  it('should render the CommentsContainer component', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='1' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const commentsContainer = screen.getByText('CommentsContainerMock');
      expect(commentsContainer).toBeInTheDocument();

      expect(CommentsContainerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          comments: CommentMocks,
        })
      );
    });
  });

  it('should render the PictureDetails component', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='1' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const pictureDetails = screen.getByText('PictureDetailsMock');
      expect(pictureDetails).toBeInTheDocument();

      expect(PictureDetailsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          descriptions: DescriptionMocks,
        })
      );
    });
  });

  it('should render a loading indicator when data is loading', () => {
    renderWithAPIMocks(
      <PictureView pictureId='1' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    const loadingElement = screen.getByText(/loading/);
    expect(loadingElement).toBeInTheDocument();
  });

  it('should render the error message related to a network error', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='2' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked network error');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should render the error message related to an api error', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='3' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked api error');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

describe('PictureView in thumbnailMode', () => {
  it('should render the picture thumbnail', () => {
    const thumbnailUrl = 'test-image.png';

    const { container } = render(
      <PictureView pictureId='1' thumbnailMode={true} thumbnailUrl={thumbnailUrl} />
    );

    const imageTags = container.getElementsByTagName('img');
    expect(imageTags).toHaveLength(1);
    expect(imageTags.item(0)).toHaveAttribute('src', asApiPath(thumbnailUrl));
  });

  it('should not render the Picture component', () => {
    render(<PictureView pictureId='1' thumbnailMode={true} thumbnailUrl='test-image.png' />);

    expect(() => screen.getByText('PictureMock')).toThrow();
  });
});
