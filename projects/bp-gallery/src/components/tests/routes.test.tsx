import React from 'react';
import { screen } from '@testing-library/react';
import { renderRoute } from '../../testUtils';
import { vi } from 'vitest';

test('Route mechanism renders the App component', () => {
  const { container } = renderRoute('/');

  expect(container.firstChild).toHaveClass('App');
});

const BrowseViewMock = vi.fn();
const BrowseViewMockComponent = (props: any) => {
  BrowseViewMock(props);
  return <div>BrowseViewMock</div>;
};
vi.doMock('../views/browse/BrowseView', () => ({ default: BrowseViewMockComponent }));

test('Accessing the browse route renders BrowseView', () => {
  renderRoute('/browse');

  const browseView = screen.getByText('BrowseViewMock');
  expect(browseView).toBeInTheDocument();
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

test('Route mechanism redirects empty route to the BrowseView component', () => {
  renderRoute('/');

  const browseView = screen.getByText('BrowseViewMock');
  expect(browseView).toBeInTheDocument();
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
