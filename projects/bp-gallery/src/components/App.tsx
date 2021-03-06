import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './top-and-bottom-bar/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, from } from '@apollo/client';
import { onError as createErrorLink } from '@apollo/client/link/error';
import NavigationBar from './top-and-bottom-bar/NavigationBar';
import {
  KeywordTagEntityResponseCollection,
  LocationTagEntityResponseCollection,
  PersonTagEntityResponseCollection,
  PictureEntity,
  PictureEntityResponseCollection,
} from '../graphql/APIConnector';
import AuthProvider from './provider/AuthProvider';
import AlertProvider, { AlertOptions, AlertType } from './provider/AlertProvider';
import DialogProvider from './provider/DialogProvider';
import { isEmpty } from 'lodash';

const apiBase = process.env.REACT_APP_API_BASE ?? '';

export const asApiPath = (pathEnding: string) => {
  // Removes any multiple occurrences of a "/"
  const formattedPathEnding = `/${pathEnding}`.replace(/\/+/gm, '/');
  return `${apiBase}${formattedPathEnding}`;
};

const OPERATIONS_WITH_OWN_ERROR_HANDLING = ['login'];

/**
 * Creates the link-chain for the {@link ApolloClient} consisting of:
 * - an HTTP-Link for using authentication via JWT and
 * - an Error-Link for globally catching errors and showing these in an Alert.
 * @param token JWT input, pass null to reset it.
 * @param openAlert the callback to open our Alert, can be obtained from the AlertContext
 */
export const buildHttpLink = (
  token: string | null,
  openAlert?: (alertOptions: AlertOptions) => void
) => {
  let httpLink = createHttpLink({
    uri: `${apiBase}/graphql`,
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (openAlert) {
    const errorLink = createErrorLink(({ graphQLErrors, networkError, operation }) => {
      if (OPERATIONS_WITH_OWN_ERROR_HANDLING.includes(operation.operationName)) return;

      const errorMessages = [];
      if (networkError) errorMessages.push(networkError);
      if (graphQLErrors) graphQLErrors.forEach(({ message }) => errorMessages.push(message));

      if (isEmpty(errorMessages)) return;

      openAlert({
        alertType: AlertType.ERROR,
        message: errorMessages.join('\n'),
        duration: 5000,
      });
    });

    httpLink = from([errorLink, httpLink]);
  }

  return httpLink;
};

const apolloClient = new ApolloClient({
  link: buildHttpLink(sessionStorage.getItem('jwt')),
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
          findPicturesByAllSearch: {
            keyArgs: ['searchTerms', 'searchTimes'],
            merge(existing = [], incoming: PictureEntity[]) {
              return [...existing, ...incoming];
            },
          },
          keywordTags: {
            keyArgs: ['filters'],
            merge(existing = { data: [] }, incoming: KeywordTagEntityResponseCollection) {
              return {
                data: [...existing.data, ...incoming.data],
              };
            },
          },
          personTags: {
            keyArgs: ['filters'],
            merge(existing = { data: [] }, incoming: PersonTagEntityResponseCollection) {
              return {
                data: [...existing.data, ...incoming.data],
              };
            },
          },
          locationTags: {
            keyArgs: ['filters'],
            merge(existing = { data: [] }, incoming: LocationTagEntityResponseCollection) {
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
      <AlertProvider>
        <AuthProvider>
          <DialogProvider>
            <div className='App'>
              <TopBar />
              {renderRoutes(route?.routes)}
              <NavigationBar />
            </div>
          </DialogProvider>
        </AuthProvider>
      </AlertProvider>
    </ApolloProvider>
  );
};
export default App;
