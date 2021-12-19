import React, { useState } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './components/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import NavigationBar, { NavigationElement } from './components/NavigationBar';

const apiBase = 'https://bp.bad-harzburg-stiftung.de/api';

export const fullApiPath = (pathEnding: string) => {
  //Removes any multiple occurences of a "/" except those who follow a ":"
  const formattedPathEnding = `/${pathEnding}`.replace(/\/{2,}/gm, '/');
  return `${apiBase}${formattedPathEnding}`;
};

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

export const NavigationContext = React.createContext<(elements: NavigationElement[]) => void>(
  (elements: NavigationElement[]) => {}
);

const App = ({ route }: RouteConfigComponentProps) => {
  const [navigationElements, setNavigationElements] = useState<NavigationElement[]>([]);
  return (
    <ApolloProvider client={apolloClient}>
      <div className='App'>
        <TopBar />
        <NavigationContext.Provider value={setNavigationElements}>
          {renderRoutes(route?.routes)}
        </NavigationContext.Provider>
        <NavigationBar elements={navigationElements} />
      </div>
    </ApolloProvider>
  );
};
export default App;
