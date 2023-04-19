import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { renderRoutes } from 'react-router-config';
import { buildHttpLink, mergeByRef, mergeByRefWrappedInData } from '../helpers/app-helpers';
import './App.scss';
import ScrollContainer from './common/ScrollContainer';
import AlertProvider from './provider/AlertProvider';
import AuthProvider from './provider/AuthProvider';
import ClipboardEditorProvider from './provider/ClipboardEditorProvider';
import DialogProvider from './provider/DialogProvider';
import { ScrollProvider } from './provider/ScrollProvider';
import StorageProvider from './provider/StorageProvider';
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
            merge: mergeByRefWrappedInData,
          },
          findPicturesByAllSearch: {
            keyArgs: ['searchTerms', 'searchTimes', 'filterOutTexts'],
            merge: mergeByRef,
          },
          keywordTags: {
            keyArgs: ['filters'],
            merge: mergeByRefWrappedInData,
          },
          personTags: {
            keyArgs: ['filters'],
            merge: mergeByRefWrappedInData,
          },
          locationTags: {
            keyArgs: ['filters'],
            merge: mergeByRefWrappedInData,
          },
        },
      },
    },
  }),
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
            <StorageProvider>
              <div className='App flex flex-col'>
                <ClipboardEditorProvider>
                  <ScrollProvider>
                    <TopBar isMobile={isMobile} />
                    <ScrollContainer>{renderRoutes(routes)}</ScrollContainer>
                    {isMobile && <NavigationBar isMobile={true} />}
                  </ScrollProvider>
                </ClipboardEditorProvider>
              </div>
            </StorageProvider>
          </DialogProvider>
        </AuthProvider>
      </AlertProvider>
    </ApolloProvider>
  );
};
export default App;
