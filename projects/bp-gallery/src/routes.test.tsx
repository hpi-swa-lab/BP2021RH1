import React from 'react';
import { screen } from '@testing-library/react';
import { renderRoute } from './testUtils';

test('Route mechanism renders our app component', () => {
  const { container } = renderRoute('/');

  expect(container.firstChild).toHaveClass('App');
});

const GalleryMock = () => <div>Gallery-Mock</div>;
jest.mock('./views/gallery/GalleryView.tsx', () => GalleryMock);

test('Route mechanism redirects to the gallery component', () => {
  renderRoute('/');
  setTimeout(() => {
    const element = screen.getByText(/Gallery-Mock/);

    expect(element).toBeInTheDocument();
  }, 0);
});

const DemoMock = () => <div>Demo-Mock</div>;
jest.mock('./prototypes/demo', () => DemoMock);

test('Route mechanism renders the demo component', () => {
  renderRoute('/prototypes/demo');

  const element = screen.getByText(/Demo-Mock/);

  expect(element).toBeInTheDocument();
});
