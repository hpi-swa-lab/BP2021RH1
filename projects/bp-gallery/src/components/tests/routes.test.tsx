import React from 'react';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderRoute, renderRouteWithAPIMocks } from '../../testUtils';

test('Route mechanism renders the App component', () => {
  const { container } = renderRouteWithAPIMocks('/');

  expect(container.firstChild).toHaveClass('App');
});

const StartViewMock = vi.fn();
const StartViewMockComponent = (props: any) => {
  StartViewMock(props);
  return <div>StartViewMock</div>;
};
vi.doMock('../views/start/StartView', () => ({ default: StartViewMockComponent }));

test('Accessing the start route renders StartView', () => {
  renderRoute('/start');

  const startView = screen.getByText('StartViewMock');
  expect(startView).toBeInTheDocument();
});

const SearchViewMock = vi.fn();
const SearchViewMockComponent = (props: any) => {
  SearchViewMock(props);
  return <div>SearchViewMock</div>;
};
vi.doMock('../views/search/SearchView', () => ({ default: SearchViewMockComponent }));

test('Accessing the search route renders SearchView', () => {
  renderRoute('/search');

  const searchView = screen.getByText('SearchViewMock');
  expect(searchView).toBeInTheDocument();
});

test('Route mechanism redirects empty route to the StartView component', () => {
  renderRouteWithAPIMocks('/');

  const startView = screen.getByText('StartViewMock');
  expect(startView).toBeInTheDocument();
});

const PictureViewMock = vi.fn();
const PictureViewMockComponent = (props: any) => {
  PictureViewMock(props);
  return <div>PictureViewMock</div>;
};
vi.doMock('../views/picture/PictureView', () => ({ default: PictureViewMockComponent }));

test('Route mechanism renders the PictureView to a picture', () => {
  renderRoute('/picture/1');

  const pictureView = screen.getByText('PictureViewMock');
  expect(pictureView).toBeInTheDocument();

  expect(PictureViewMock).toHaveBeenCalledWith(
    expect.objectContaining({
      initialPictureId: '1',
    })
  );
});

const DemoMock = () => <div>DemoMock</div>;
vi.doMock('../../prototypes/demo', () => ({ default: DemoMock }));

test('Route mechanism renders the Demo component', () => {
  renderRoute('/prototypes/demo');

  const demo = screen.getByText('DemoMock');
  expect(demo).toBeInTheDocument();
});

const TimeLineDemo = () => <div>TimelineDemoMock</div>;
vi.doMock('../../prototypes/timeline-demo', () => ({ default: TimeLineDemo }));

test('Route mechanism renders the TimeLineDemo component', () => {
  renderRoute('/prototypes/timeline-demo');

  const timeLineDemo = screen.getByText('TimelineDemoMock');
  expect(timeLineDemo).toBeInTheDocument();
});
