import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './views/shared/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import NavigationBar from './views/shared/NavigationBar';
import { PictureEntityResponseCollection } from './graphql/APIConnector';
import AuthWrapper from './AuthWrapper';
import AlertWrapper from './views/shared/AlertWrapper';
import DialogWrapper from './views/shared/DialogWrapper';

const apiBase = process.env.REACT_APP_API_BASE ?? '';

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
    addTypename: true,
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
      <AlertWrapper>
        <DialogWrapper>
          <AuthWrapper>
            <div className='App'>
              <TopBar />
              {renderRoutes(route?.routes)}
              <NavigationBar />
            </div>
          </AuthWrapper>
        </DialogWrapper>
      </AlertWrapper>
    </ApolloProvider>
  );
};
export default App;
