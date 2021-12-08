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
    //Source: https://www.apollographql.com/docs/react/pagination/core-api/#merging-paginated-results
    typePolicies: {
      Query: {
        fields: {
          pictures: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,
            // Concatenate the incoming list items with
            // the existing list items.
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
