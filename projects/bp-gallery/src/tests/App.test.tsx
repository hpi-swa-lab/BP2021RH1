import routes from '../routes';
import { renderRouteWithAPIMocks } from '../testUtils';

test('Top bar is always visible', () => {
  routes[0].routes?.forEach(route => {
    const { container } = renderRouteWithAPIMocks(route.path as string, []);

    const topBars = container.getElementsByClassName('top-bar');

    expect(topBars).toHaveLength(1);
  });
});
