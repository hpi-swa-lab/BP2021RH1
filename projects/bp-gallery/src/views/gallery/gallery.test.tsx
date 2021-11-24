import { renderRoute } from '../../testUtils';

test('Nav bar contains search, browse and menu button', () => {
  const { container } = renderRoute('/browse');

  const navBarLinks = container.querySelectorAll('.nav-bar > .nav-element > .nav-element-title');

  expect(navBarLinks).toHaveLength(3);
  expect(
    Array.prototype.every.call(navBarLinks, link =>
      ['common.search', 'common.browse', 'common.menu'].includes(link.innerHTML as string)
    )
  ).toBe(true);
});
