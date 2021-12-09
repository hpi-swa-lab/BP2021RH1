import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './components/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

export const apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

const apolloClient = new ApolloClient({
  uri: `${apiBase}/graphql`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          pictures: {
            // Treat picture queries as the same query, as long as the where clause is equal
            // Queries which only differ in other fields as 'start' or 'limit' get treated as one query and the results get merged
            keyArgs: ['where'],
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
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
      <div className='App'>
        <TopBar />
        {renderRoutes(route?.routes)}
      </div>
    </ApolloProvider>
  );
};
export default App;
