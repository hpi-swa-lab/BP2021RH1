import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './components/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import NavigationBar from './components/NavigationBar';
import { PictureEntityResponseCollection } from './graphql/APIConnector';
import AuthWrapper from './AuthWrapper';

const apiBase = 'https://bp.bad-harzburg-stiftung.de/api';

export const asApiPath = (pathEnding: string) => {
  //Removes any multiple occurences of a "/"
  const formattedPathEnding = `/${pathEnding}`.replace(/\/+/gm, '/');
  return `${apiBase}${formattedPathEnding}`;
};

export const httpLink = (token: string | null) =>
  createHttpLink({
    uri: `${apiBase}/graphql`,
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

const apolloClient = new ApolloClient({
  link: httpLink(sessionStorage.getItem('jwt')),
  cache: new InMemoryCache({
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
  }),
});

const App = ({ route }: RouteConfigComponentProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthWrapper>
        <div className='App'>
          <TopBar />
          {renderRoutes(route?.routes)}
          <NavigationBar />
        </div>
      </AuthWrapper>
    </ApolloProvider>
  );
};
export default App;
