import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import PictureScrollOverview from '../PictureScrollOverview';
import { renderWithAPIMocks } from '../../../../testUtils';
import { GetPicturesDocumentMocks } from './mocks';
import { asApiPath } from '../../../../App';

describe('PictureScrollOverview in basic functionality without refetching', () => {
  it('should render all queried pictures in thumbnail-mode', async () => {
    const { container } = renderWithAPIMocks(
      <PictureScrollOverview filters={{}} scrollPos={0} scrollHeight={2 * window.innerHeight} />,
      GetPicturesDocumentMocks
    );
    await waitFor(() => {
      const imageTags = container.getElementsByTagName('img');
      expect(imageTags).toHaveLength(4);
      expect(imageTags.item(0)).toHaveAttribute(
        'src',
        asApiPath('test-image.jpg?updatedAt=21042022')
      );
      expect(imageTags.item(3)).toHaveAttribute(
        'src',
        asApiPath('test-image4.jpg?updatedAt=21042022')
      );
    });
  });

  it('should render the error message related to a network error', async () => {
    renderWithAPIMocks(
      <PictureScrollOverview filters={{ id: { eq: '0' } }} scrollPos={0} scrollHeight={0} />,
      GetPicturesDocumentMocks
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked network error');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should render the error message related to an api error', async () => {
    renderWithAPIMocks(
      <PictureScrollOverview filters={{ id: { eq: '-1' } }} scrollPos={0} scrollHeight={0} />,
      GetPicturesDocumentMocks
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked api error');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

describe('Refetch functionality in PictureScrollOverview', () => {
  it('should render more pictures after refetching', async () => {
    const { container } = renderWithAPIMocks(
      <PictureScrollOverview filters={{}} scrollPos={0} scrollHeight={2 * window.innerHeight} />,
      GetPicturesDocumentMocks,
      true
    );
    await waitFor(() => {
      const imageTags = container.getElementsByTagName('img');
      expect(imageTags.length).toBeLessThanOrEqual(4);
    });

    renderWithAPIMocks(
      <PictureScrollOverview
        filters={{}}
        scrollPos={2 * window.innerHeight} // simulates scrolling to the bottom
        scrollHeight={2 * window.innerHeight}
      />,
      GetPicturesDocumentMocks,
      true
    );

    await waitFor(() => {
      const imageTags = container.getElementsByTagName('img');
      expect(imageTags.length).toBeGreaterThan(4);
    });
  });
});
