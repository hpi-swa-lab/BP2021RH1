import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { renderRoutes } from 'react-router-config';
import { buildHttpLink, mergeByRef } from '../helpers/app-helpers';
import './App.scss';
import { ClipboardEditorProvider } from './common/clipboard/ClipboardEditorContext';
import AlertProvider from './provider/AlertProvider';
import AuthProvider from './provider/AuthProvider';
import ClipboardProvider from './provider/ClipboardProvider';
import DialogProvider from './provider/DialogProvider';
import routes from './routes';
import NavigationBar from './top-and-bottom-bar/NavigationBar';
import TopBar from './top-and-bottom-bar/TopBar';

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
            merge: mergeByRef,
          },
          findPicturesByAllSearch: {
            keyArgs: ['searchTerms', 'searchTimes'],
            merge: mergeByRef,
          },
          keywordTags: {
            keyArgs: ['filters'],
            merge: mergeByRef,
          },
          personTags: {
            keyArgs: ['filters'],
            merge: mergeByRef,
          },
          locationTags: {
            keyArgs: ['filters'],
            merge: mergeByRef,
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

const App = () => {
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
                <ClipboardEditorProvider>
                  <TopBar isMobile={isMobile} />
                  {renderRoutes(routes)}
                  {isMobile && <NavigationBar isMobile={true} />}
                </ClipboardEditorProvider>
              </div>
            </ClipboardProvider>
          </DialogProvider>
        </AuthProvider>
      </AlertProvider>
    </ApolloProvider>
  );
};
export default App;
