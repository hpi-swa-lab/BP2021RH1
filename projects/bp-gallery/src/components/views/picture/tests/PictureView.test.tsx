import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithAPIMocks } from '../../../../testUtils';
import { asApiPath } from '../../../App';
import { GetPictureInfoDocumentMocks } from './mocks';
import PictureView from '../PictureView';
import { vi } from 'vitest';

const PictureViewUIMock = vi.fn();
const PictureViewUIMockComponent = (props: any) => {
  PictureViewUIMock(props);
  return <div>PictureViewUIMock</div>;
};
vi.doMock('../overlay/PictureViewUI', () => ({ default: PictureViewUIMockComponent }));

vi.doMock('react-router-dom', () => ({
  useHistory: () => ({
    block: vi.fn(() => vi.fn()),
  }),
}));

describe('PictureView', () => {
  const imageURL = 'test-image.jpg?updatedAt=21042022';

  it('should render the picture', async () => {
    const { container } = renderWithAPIMocks(
      <PictureView initialPictureId='1' />,
      GetPictureInfoDocumentMocks
    );

    await waitFor(() => {
      const imageTags = container.getElementsByTagName('img');
      expect(imageTags).toHaveLength(1);
      expect(imageTags.item(0)).toBeInTheDocument();
      expect(imageTags.item(0)).toHaveAttribute('src', asApiPath(imageURL));
    });
  });

  it('should render the Sidebar component', async () => {
    const { container } = renderWithAPIMocks(
      <PictureView initialPictureId='1' />,
      GetPictureInfoDocumentMocks
    );

    await waitFor(() => {
      const pictureDetails = container.querySelector('.picture-sidebar');
      expect(pictureDetails).toBeInTheDocument();
    });
  });

  it('should render the PictureViewUI component', async () => {
    renderWithAPIMocks(<PictureView initialPictureId='1' />, GetPictureInfoDocumentMocks);

    await waitFor(() => {
      const pictureDetails = screen.getByText('PictureViewUIMock');
      expect(pictureDetails).toBeInTheDocument();

      expect(PictureViewUIMock).toHaveBeenCalledWith(
        expect.objectContaining({
          calledViaLink: true,
        })
      );
    });
  });

  it('should render a loading indicator when data is loading', async () => {
    renderWithAPIMocks(<PictureView initialPictureId='1' />, GetPictureInfoDocumentMocks);
    await waitFor(() => {
      const loadingElement = screen.getByText(/loading/);
      expect(loadingElement).toBeInTheDocument();
    });
  });

  it('should render the error message related to a network error', async () => {
    renderWithAPIMocks(<PictureView initialPictureId='2' />, GetPictureInfoDocumentMocks);

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked network error');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should render the error message related to an api error', async () => {
    renderWithAPIMocks(<PictureView initialPictureId='3' />, GetPictureInfoDocumentMocks);

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked api error');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
