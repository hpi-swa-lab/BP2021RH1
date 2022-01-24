import React from 'react';
import { screen } from '@testing-library/react';
import { renderRoute } from '../testUtils';

test('Route mechanism renders the App component', () => {
  const { container } = renderRoute('/');

  expect(container.firstChild).toHaveClass('App');
});

const GalleryViewMock = jest.fn();
const GalleryViewMockComponent = (props: any) => {
  GalleryViewMock(props);
  return <div>GalleryViewMock</div>;
};
jest.mock('../views/gallery/GalleryView', () => GalleryViewMockComponent);

test('Route mechanism renders the GalleryView component with browse target', () => {
  renderRoute('/browse');

  const galleryView = screen.getByText('GalleryViewMock');
  expect(galleryView).toBeInTheDocument();

  expect(GalleryViewMock).toHaveBeenCalledWith(
    expect.objectContaining({
      target: 'browse',
    })
  );
});

test('Route mechanism renders the GalleryView component with search target', () => {
  renderRoute('/search');

  const galleryView = screen.getByText('GalleryViewMock');
  expect(galleryView).toBeInTheDocument();

  expect(GalleryViewMock).toHaveBeenCalledWith(
    expect.objectContaining({
      target: 'search',
    })
  );
});

test('Route mechanism redirects empty route to the GalleryView component', () => {
  renderRoute('/');

  const galleryView = screen.getByText('GalleryViewMock');
  expect(galleryView).toBeInTheDocument();
});

const PictureViewMock = jest.fn();
const PictureViewMockComponent = (props: any) => {
  PictureViewMock(props);
  return <div>PictureViewMock</div>;
};
jest.mock('../views/picture/PictureView', () => PictureViewMockComponent);

test('Route mechanism renders the PictureView to a picture in non-thumbnailMode', () => {
  renderRoute('/picture/1');

  const pictureView = screen.getByText('PictureViewMock');
  expect(pictureView).toBeInTheDocument();

  expect(PictureViewMock).toHaveBeenCalledWith(
    expect.objectContaining({
      pictureId: '1',
      isInitialThumbnail: false,
    })
  );
});

const DemoMock = () => <div>DemoMock</div>;
jest.mock('../prototypes/demo', () => DemoMock);

test('Route mechanism renders the Demo component', () => {
  renderRoute('/prototypes/demo');

  const demo = screen.getByText('DemoMock');
  expect(demo).toBeInTheDocument();
});

const TimeLineDemo = () => <div>TimelineDemoMock</div>;
jest.mock('../prototypes/timeline-demo', () => TimeLineDemo);

test('Route mechanism renders the TimeLineDemo component', () => {
  renderRoute('/prototypes/timeline-demo');

  const timeLineDemo = screen.getByText('TimelineDemoMock');
  expect(timeLineDemo).toBeInTheDocument();
});
