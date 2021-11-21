import routes from './routes';
import { renderRoute } from './testUtils';

test('Top bar is always visible', () => {
  routes[0]?.routes?.forEach(route => {
    const { container } = renderRoute(route.path as string);

    const topBars = container.getElementsByClassName('top-bar');

    expect(topBars).toHaveLength(1);
  });
});
