import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import PictureScrollGrid from '../PictureScrollGrid';
import { renderWithAPIMocks } from '../../../../testUtils';
import { PictureViewMocks } from './mocks';
import { asApiPath } from '../../../../App';

describe('PictureScrollGrid in basic functionality without refetching', () => {
  it('should render all queried pictures in thumbnail-mode', async () => {
    const { container } = renderWithAPIMocks(
      <PictureScrollGrid
        where={''}
        scrollPos={0}
        scrollHeight={2 * window.innerHeight}
        hashbase={'A'}
      />,
      PictureViewMocks
    );
    await waitFor(() => {
      const imageTags = container.getElementsByTagName('img');
      expect(imageTags).toHaveLength(4);
      expect(imageTags.item(0)).toHaveAttribute('src', asApiPath('test-image.jpg'));
      expect(imageTags.item(3)).toHaveAttribute('src', asApiPath('test-image4.jpg'));
    });
  });

  it('should render the error message related to a network error', async () => {
    renderWithAPIMocks(
      <PictureScrollGrid where={'{id: 0}'} scrollPos={0} scrollHeight={0} hashbase={'A'} />,
      PictureViewMocks
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked network error');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should render the error message related to an api error', async () => {
    renderWithAPIMocks(
      <PictureScrollGrid where={'{id: -1}'} scrollPos={0} scrollHeight={0} hashbase={'A'} />,
      PictureViewMocks
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('mocked api error');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

describe('Refetch functionality in PictureScrollGrid', () => {
  it('should render more pictures after refetching', async () => {
    const { container, rerender } = renderWithAPIMocks(
      <PictureScrollGrid
        where={''}
        scrollPos={0}
        scrollHeight={2 * window.innerHeight}
        hashbase={'A'}
      />,
      PictureViewMocks
    );
    await waitFor(() => {
      const imageTags = container.getElementsByTagName('img');
      expect(imageTags.length).toBeLessThanOrEqual(4);
    });

    rerender(
      <PictureScrollGrid
        where={''}
        scrollPos={2 * window.innerHeight}
        scrollHeight={2 * window.innerHeight}
        hashbase={'A'}
      />
    );

    await waitFor(() => {
      const imageTags = container.getElementsByTagName('img');
      expect(imageTags.length).toBeGreaterThan(4);
    });
  });
});
