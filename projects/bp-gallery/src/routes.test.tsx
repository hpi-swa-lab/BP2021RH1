import React from 'react';
import { screen } from '@testing-library/react';
import { renderRoute } from './testUtils';

test('Route mechanism renders our app component', () => {
  const { container } = renderRoute('/');

  expect(container.firstChild).toHaveClass('App');
});

const GalleryMock = () => <div>Gallery-Mock</div>;
jest.mock('./views/gallery/GalleryView.tsx', () => GalleryMock);

test('Route mechanism redirects empty route to the gallery component', () => {
  renderRoute('/');

  const element = screen.getByText('Gallery-Mock');

  expect(element).toBeInTheDocument();
});

const DemoMock = () => <div>Demo-Mock</div>;
jest.mock('./prototypes/demo', () => DemoMock);

test('Route mechanism renders the demo component', () => {
  renderRoute('/prototypes/demo');

  const element = screen.getByText('Demo-Mock');

  expect(element).toBeInTheDocument();
});
