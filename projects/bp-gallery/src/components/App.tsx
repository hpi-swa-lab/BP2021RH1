import React, { useEffect, useState } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './top-and-bottom-bar/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, from } from '@apollo/client';
import { onError as createErrorLink } from '@apollo/client/link/error';
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
import NavigationBar from './top-and-bottom-bar/NavigationBar';
import ClipboardProvider from './provider/ClipboardProvider';
import { ClipboardEditor } from './common/clipboard/ClipboardEditor';

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
    typePolicies: {
      ...Object.fromEntries(
        [
          'ArchiveTag',
          'Collection',
          'Comment',
          'Description',
          'KeywordTag',
          'LocationTag',
          'PersonTag',
          'Picture',
          'TimeRangeTag',
          'UploadFile',
        ].map(entity => [entity, { merge: true }])
      ),
      Query: {
        fields: {
          pictures: {
            // Treat picture queries as the same query, as long as the filters clause is equal.
            // Queries which only differ in other fields (e.g. the pagination fields 'start' or 'limit')
            // get treated as one query and the results get merged.
            keyArgs: ['filters'],
            merge(existing = { data: [] }, incoming: PictureEntityResponseCollection) {
              return {
                ...incoming,
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
                ...incoming,
                data: [...existing.data, ...incoming.data],
              };
            },
          },
          personTags: {
            keyArgs: ['filters'],
            merge(existing = { data: [] }, incoming: PersonTagEntityResponseCollection) {
              return {
                ...incoming,
                data: [...existing.data, ...incoming.data],
              };
            },
          },
          locationTags: {
            keyArgs: ['filters'],
            merge(existing = { data: [] }, incoming: LocationTagEntityResponseCollection) {
              return {
                ...incoming,
                data: [...existing.data, ...incoming.data],
              };
            },
          },
        },
      },
    },
  }),
});

document.body.addEventListener('keyup', event => {
  // alt+c clears apollo cache, as a temporary workaround
  // for the broken cache configuration
  if (event.altKey && event.code === 'KeyC') {
    const { cache } = apolloClient;
    cache.evict({ id: 'ROOT_QUERY' });
    cache.evict({ id: 'ROOT_MUTATION' });
    cache.gc();
  }
});

const App = ({ route }: RouteConfigComponentProps) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 750;

  return (
    <ApolloProvider client={apolloClient}>
      <AlertProvider>
        <AuthProvider>
          <DialogProvider>
            <ClipboardProvider>
              <div className='App'>
                <TopBar isMobile={isMobile} />
                {renderRoutes(route?.routes)}
                {isMobile && <NavigationBar isMobile={true} />}
                <ClipboardEditor />
              </div>
            </ClipboardProvider>
          </DialogProvider>
        </AuthProvider>
      </AlertProvider>
    </ApolloProvider>
  );
};
export default App;
