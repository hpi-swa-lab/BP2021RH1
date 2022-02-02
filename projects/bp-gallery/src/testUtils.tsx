import React, { ReactComponentElement } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import routes from './routes';
import NavigationBar from './components/NavigationBar';
import TopBar from './components/TopBar';
import { PictureEntityResponseCollection } from './graphql/APIConnector';
import AuthWrapper from './AuthWrapper';
import AlertWrapper from './components/AlertWrapper';

/**
 * Enables using Navigation-Context in tests
 */
const MockedApp = ({ children }: { children: any }) => {
  return (
    <div className='App'>
      <TopBar />
      {children}
      <NavigationBar />
    </div>
  );
};

/**
 * Enables test-rendering of components with mocked GraphQL-responses
 * @see https://www.apollographql.com/docs/react/development-testing/testing/#the-mockedprovider-component
 */
export const renderWithAPIMocks = (
  component: ReactComponentElement<any>,
  apiMocks: MockedResponse[] = [],
  enableCache: boolean = false
) => {
  return render(
    <AlertWrapper>{_wrapInMockedProvider(component, apiMocks, enableCache)}</AlertWrapper>
  );
};

// In order to supply the `MockedProvider` with the same config as the real client gets
const cache = new InMemoryCache({
  addTypename: false,
  typePolicies: {
    Query: {
      fields: {
        pictures: {
          // Treat picture queries as the same query, as long as the filters clause is equal.
          // Queries which only differ in other fields (e.g. the pagination fields 'start' or 'limit')
          // get treated as one query and the results get merged.
          keyArgs: ['filters'],
          merge(existing = { data: [] }, incoming: PictureEntityResponseCollection) {
            return {
              data: [...existing.data, ...incoming.data],
            };
          },
        },
      },
    },
  },
});

/**
 * @private
 */
const _wrapInMockedProvider = (
  component: ReactComponentElement<any>,
  apiMocks: MockedResponse[],
  enableCache: boolean
) => {
  const optionalCache = enableCache ? cache : undefined;
  return (
    <MockedProvider addTypename={false} mocks={apiMocks} cache={optionalCache}>
      <AuthWrapper>{component}</AuthWrapper>
    </MockedProvider>
  );
};

/**
 * Enables test-rendering of components based on our prior defined routes
 * @see https://testing-library.com/docs/example-react-router/
 * @private
 */
const _renderRoute = (route: string, apiMocks?: MockedResponse[], enableCache: boolean = false) => {
  window.history.pushState({}, 'Test page', route);

  const routesContent = <MockedApp>{renderRoutes(routes[0].routes)}</MockedApp>;
  const contentToWrapInRouter = apiMocks
    ? _wrapInMockedProvider(routesContent, apiMocks, enableCache)
    : routesContent;
  return render(
    <BrowserRouter>
      <AlertWrapper>{contentToWrapInRouter}</AlertWrapper>
    </BrowserRouter>
  );
};

export const renderRoute = (route: string) => {
  return _renderRoute(route);
};

/**
 * Merges the functionalities of renderRoute and renderWithAPIMocks
 */
export const renderRouteWithAPIMocks = (
  route: string,
  apiMocks: MockedResponse[] = [],
  enableCache: boolean = false
) => {
  return _renderRoute(route, apiMocks, enableCache);
};
