import React from 'react';
import { screen } from '@testing-library/react';
import { renderRoute } from '../../../testUtils';

const BrowseViewMock = () => <div>BrowseViewMock</div>;
jest.mock('../browse/BrowseView', () => BrowseViewMock);

test('Nav bar in browse-context contains search, browse and menu nav link', () => {
  const { container } = renderRoute('/browse');

  const navBarLinks = container.getElementsByClassName('nav-element-title');
  expect(navBarLinks).toHaveLength(3);

  const actualLinkTitles = Array.from(navBarLinks).map(linkNode => linkNode.innerHTML);
  ['common.search', 'common.browse', 'common.menu'].forEach(expectedLinkTitle =>
    expect(actualLinkTitles).toContain(expectedLinkTitle)
  );
});

test('GalleryView with browse target renders BrowseView', () => {
  renderRoute('/browse');

  const browseView = screen.getByText('BrowseViewMock');
  expect(browseView).toBeInTheDocument();
});

const SearchViewMock = () => <div>SearchViewMock</div>;
jest.mock('../search/SearchView', () => SearchViewMock);

test('GalleryView with search target renders SearchView', () => {
  renderRoute('/search');

  const searchView = screen.getByText('SearchViewMock');
  expect(searchView).toBeInTheDocument();
});
