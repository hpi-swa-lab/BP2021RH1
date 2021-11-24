import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routes';

/**
 * Enables test-rendering of components based on our prior defined routes
 * @see https://testing-library.com/docs/example-react-router/
 */
export const renderRoute = (route: string) => {
  window.history.pushState({}, 'Test page', route);
  return render(<BrowserRouter>{renderRoutes(routes)}</BrowserRouter>);
};
