import { renderRoute } from '../../../testUtils';
import React from 'react';

const BrowseViewMock = () => <div>BrowseViewMock</div>;
jest.mock('../../views/browse/BrowseView', () => BrowseViewMock);

test('Nav bar in browse-context contains search, browse and menu nav link', () => {
  const { container } = renderRoute('/browse');

  const navBarLinks = container.getElementsByClassName('nav-element-title');
  expect(navBarLinks).toHaveLength(3);

  const actualLinkTitles = Array.from(navBarLinks).map(linkNode => linkNode.innerHTML);
  ['common.search', 'common.browse', 'common.more'].forEach(expectedLinkTitle =>
    expect(actualLinkTitles).toContain(expectedLinkTitle)
  );
});
