import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithAPIMocks } from '../../../testUtils';
import { asApiPath } from '../../../App';
import { GetPictureInfoDocumentMocks } from './mocks';
import PictureView from '../PictureView';

const PictureViewUIMock = jest.fn();
const PictureViewUIMockComponent = (props: any) => {
  PictureViewUIMock(props);
  return <div>PictureViewUIMock</div>;
};
jest.mock('../PictureViewUI', () => PictureViewUIMockComponent);

describe('PictureView', () => {
  describe('in non-thumbnailMode', () => {
    const imageURL = 'test-image.jpg';

    it('should render the picture', async () => {
      const { container } = renderWithAPIMocks(
        <PictureView pictureId='1' isInitialThumbnail={false} />,
        GetPictureInfoDocumentMocks
      );

      await waitFor(() => {
        const imageTags = container.getElementsByTagName('img');
        expect(imageTags).toHaveLength(1);
        expect(imageTags.item(0)).toBeInTheDocument();
        expect(imageTags.item(0)).toHaveAttribute('src', asApiPath(imageURL));
      });
    });

    it('should render the PictureInfo component', async () => {
      const { container } = renderWithAPIMocks(
        <PictureView pictureId='1' isInitialThumbnail={false} />,
        GetPictureInfoDocumentMocks
      );

      await waitFor(() => {
        const pictureDetails = container.querySelector('.picture-info-container');
        expect(pictureDetails).toBeInTheDocument();
      });
    });

    it('should render the PictureViewUI component', async () => {
      renderWithAPIMocks(
        <PictureView pictureId='1' isInitialThumbnail={false} />,
        GetPictureInfoDocumentMocks
      );

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
      renderWithAPIMocks(
        <PictureView pictureId='1' isInitialThumbnail={false} />,
        GetPictureInfoDocumentMocks
      );
      await waitFor(() => {
        const loadingElement = screen.getByText(/loading/);
        expect(loadingElement).toBeInTheDocument();
      });
    });

    it('should render the error message related to a network error', async () => {
      renderWithAPIMocks(
        <PictureView pictureId='2' isInitialThumbnail={false} />,
        GetPictureInfoDocumentMocks
      );

      await waitFor(() => {
        const errorMessage = screen.getByText('mocked network error');
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should render the error message related to an api error', async () => {
      renderWithAPIMocks(
        <PictureView pictureId='3' isInitialThumbnail={false} />,
        GetPictureInfoDocumentMocks
      );

      await waitFor(() => {
        const errorMessage = screen.getByText('mocked api error');
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
  describe('in thumbnailMode', () => {
    it('should render the picture thumbnail', () => {
      const thumbnailUrl = 'test-image.png';

      const { container } = render(
        <PictureView pictureId='1' isInitialThumbnail={true} thumbnailUrl={thumbnailUrl} />
      );

      const imageTags = container.getElementsByTagName('img');
      expect(imageTags).toHaveLength(1);
      expect(imageTags.item(0)).toHaveAttribute('src', asApiPath(thumbnailUrl));
    });

    it('should not render the info component', () => {
      const { container } = render(
        <PictureView pictureId='1' isInitialThumbnail={true} thumbnailUrl='test-image.png' />
      );
      const infoComponent = container.querySelector('.picture-info-container');

      expect(infoComponent).toBeNull();
    });

    it('should not render the picture ui component', () => {
      render(<PictureView pictureId='1' isInitialThumbnail={true} thumbnailUrl='test-image.png' />);

      expect(() => screen.getByText('PictureViewUIMock')).toThrow();
    });
  });
});
