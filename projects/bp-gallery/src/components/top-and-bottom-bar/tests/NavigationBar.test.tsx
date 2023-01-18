import { renderRoute } from '../../../testUtils';
import React from 'react';

const TopBarMock = () => <div>TopBarMock</div>;
jest.mock('../TopBar', () => TopBarMock);

const StartViewMock = () => <div>StartViewMock</div>;
jest.mock('../../views/start/StartView', () => StartViewMock);

test('Nav bar in browse-context contains search, browse and menu nav link', () => {
  const { container } = renderRoute('/start');

  const navBarLinks = container.getElementsByClassName('nav-element-title');
  expect(navBarLinks).toHaveLength(3);

  const actualLinkTitles = Array.from(navBarLinks).map(linkNode => linkNode.innerHTML);
  ['common.search', 'common.start', 'login.title'].forEach(expectedLinkTitle =>
    expect(actualLinkTitles).toContain(expectedLinkTitle)
  );
});
