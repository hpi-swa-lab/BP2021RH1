import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './components/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { apiBase } from './ApiConnector';

const App = ({ route }: RouteConfigComponentProps) => {
  const apolloClient = new ApolloClient({
    uri: `${apiBase}/graphql`,
    cache: new InMemoryCache(),
  });

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
