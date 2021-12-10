import React from 'react';
import { waitFor, screen, render } from '@testing-library/react';
import { renderWithAPIMocks } from '../../../testUtils';
import { apiBase } from '../../../App';
import { ComponentContentComment, Description } from '../../../graphql/APIConnector';
import { GetInfoPictureDocumentMocks } from './mocks';
import PictureView from '../PictureView';

const PictureMock = ({ url }: { url: string }) => <div>Picture-Mock of {url}</div>;
jest.mock('../Picture', () => PictureMock);

const PictureDetailsMock = ({ descriptions }: { descriptions: Description[] }) => (
  <div>
    PictureDetails-Mock
    {descriptions.map(description => (
      <span key={description.id}>{description.text}</span>
    ))}
  </div>
);
jest.mock('../PictureDetails', () => PictureDetailsMock);

const CommentsContainerMock = ({ comments }: { comments: ComponentContentComment[] }) => (
  <div>
    CommentsContainer-Mock
    {comments.map(comment => (
      <span key={comment.id}>{comment.text}</span>
    ))}
  </div>
);
jest.mock('../comments/CommentsContainer', () => CommentsContainerMock);

describe('PictureView in non-thumbnailMode', () => {
  it('should render the Picture component', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='1' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const pictureElement = screen.getByText(/Picture-Mock/);
      expect(pictureElement).toBeInTheDocument();

      expect(pictureElement).toHaveTextContent(/test-image.jpg/);
    });
  });

  it('should render the CommentsContainer component', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='1' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const commentsContainer = screen.getByText('CommentsContainer-Mock');
      expect(commentsContainer).toBeInTheDocument();

      const comments = commentsContainer.getElementsByTagName('span');
      expect(comments).toHaveLength(2);
      expect(comments.item(0)).toHaveTextContent('My fancy comment');
      expect(comments.item(1)).toHaveTextContent('My fancy comment yeah');
    });
  });

  it('should render the PictureDetails component', async () => {
    renderWithAPIMocks(
      <PictureView pictureId='1' thumbnailMode={false} />,
      GetInfoPictureDocumentMocks
    );

    await waitFor(() => {
      const pictureDetails = screen.getByText('PictureDetails-Mock');
      expect(pictureDetails).toBeInTheDocument();

      const comments = pictureDetails.getElementsByTagName('span');
      expect(comments).toHaveLength(1);
      expect(comments.item(0)).toHaveTextContent('My fancy description');
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
    expect(imageTags.item(0)).toHaveAttribute('src', `${apiBase}${thumbnailUrl}`);
  });
});
