import routes from '../routes';
import { renderRouteWithAPIMocks } from '../testUtils';

test('Top bar is always visible', () => {
  (routes[0].routes ?? [])
    .filter(route => route.path)
    .forEach(route => {
      const { container, unmount } = renderRouteWithAPIMocks(route.path as string, []);

      const topBars = container.getElementsByClassName('top-bar');
      expect(topBars).toHaveLength(1);

      unmount(); // unmount components of the route so those dont interfere with the next route
    });
});
