import routes from './routes';
import { renderRoute } from './testUtils';

test('Navigation bar is always visible', () => {
  routes[0]?.routes?.forEach(route => {
    renderRoute(route.path as string);

    window.setTimeout(() => {
      const navBars = document.getElementsByClassName('nav-bar');
      expect(navBars.length).toBe(1);
    }, 0);
  });
});

test('Top bar is always visible', () => {
  routes[0]?.routes?.forEach(route => {
    renderRoute(route.path as string);

    window.setTimeout(() => {
      const topBars = document.getElementsByClassName('top-bar');

      expect(topBars.length).toBe(1);
    }, 0);
  });
});
