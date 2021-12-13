import React, { ReactComponentElement } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import routes from './routes';

/**
 * Enables test-rendering of components with mocked GraphQL-responses
 * @see https://www.apollographql.com/docs/react/development-testing/testing/#the-mockedprovider-component
 */
export const renderWithAPIMocks = (
  component: ReactComponentElement<any>,
  apiMocks: MockedResponse[] = []
) => {
  return render(
    <MockedProvider addTypename={false} mocks={apiMocks}>
      {component}
    </MockedProvider>
  );
};

/**
 * Enables test-rendering of components based on our prior defined routes
 * @see https://testing-library.com/docs/example-react-router/
 * @private
 */
const _renderRoute = (route: string, apiMocks?: MockedResponse[]) => {
  window.history.pushState({}, 'Test page', route);

  const routesContent = renderRoutes(routes);
  const contentToWrapInRouter = apiMocks
    ? renderWithAPIMocks(routesContent, apiMocks)
    : routesContent;
  return render(<BrowserRouter>{contentToWrapInRouter}</BrowserRouter>);
};

export const renderRoute = (route: string) => {
  return _renderRoute(route);
};

/**
 * Merges the functionalities of renderRoute and renderWithAPIMocks
 */
export const renderRouteWithAPIMocks = (route: string, apiMocks: MockedResponse[] = []) => {
  return _renderRoute(route, apiMocks);
};
