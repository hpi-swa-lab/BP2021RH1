import routes from './routes';
import { renderRoute } from './testUtils';

test('Navigation bar is always visible', () => {
  routes.forEach(route => {
    renderRoute(route.path as string);

    const navBars = document.getElementsByClassName('nav-bar');

    expect(navBars.length).toBe(1);
  });
});

test('Top bar is always visible', () => {
  routes.forEach(route => {
    renderRoute(route.path as string);

    const topBars = document.getElementsByClassName('top-bar');

    expect(topBars.length).toBe(1);
  });
});
