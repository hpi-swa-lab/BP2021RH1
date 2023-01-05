import { renderRoute } from '../../../testUtils';
import React from 'react';
import { vi } from 'vitest';

const TopBarMock = () => <div>TopBarMock</div>;
vi.doMock('../TopBar', () => ({ default: TopBarMock }));

const StartViewMock = () => <div>StartViewMock</div>;
vi.doMock('../../views/start/StartView', () => ({ default: StartViewMock }));

test('Nav bar in browse-context contains search, browse and menu nav link', () => {
  const { container } = renderRoute('/start');

  const navBarLinks = container.getElementsByClassName('nav-element-title');
  expect(navBarLinks).toHaveLength(3);

  const actualLinkTitles = Array.from(navBarLinks).map(linkNode => linkNode.innerHTML);
  ['common.search', 'common.start', 'login.title'].forEach(expectedLinkTitle =>
    expect(actualLinkTitles).toContain(expectedLinkTitle)
  );
});
