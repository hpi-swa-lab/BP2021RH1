import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { renderRoutes } from 'react-router-config';
import { buildHttpLink, mergeByRef, mergeByRefWrappedInData } from '../helpers/app-helpers';
import './App.scss';
import ScrollContainer from './common/ScrollContainer';
import AlertProvider from './provider/AlertProvider';
import AuthProvider from './provider/AuthProvider';
import ClipboardEditorProvider from './provider/ClipboardEditorProvider';
import DialogProvider from './provider/DialogProvider';
import { GrowthBookProvider } from './provider/GrowthBookProvider';
import { MobileProvider } from './provider/MobileProvider';
import { MuiThemeProvider } from './provider/MuiThemeProvider';
import { ScrollProvider } from './provider/ScrollProvider';
import routes from './routes';
import BottomBar from './top-and-bottom-bar/BottomBar';
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
            keyArgs: ['searchTerms', 'searchTimes', 'textFilter'],
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
  return (
    <ApolloProvider client={apolloClient}>
      <MuiThemeProvider>
        <AlertProvider>
          <AuthProvider>
            <DialogProvider>
              <MobileProvider>
                <div className='App'>
                  <ClipboardEditorProvider>
                    <GrowthBookProvider>
                      <ScrollProvider useWindow>
                        <TopBar />
                        <ScrollContainer>{renderRoutes(routes)}</ScrollContainer>
                        <BottomBar />
                      </ScrollProvider>
                    </GrowthBookProvider>
                  </ClipboardEditorProvider>
                </div>
              </MobileProvider>
            </DialogProvider>
          </AuthProvider>
        </AlertProvider>
      </MuiThemeProvider>
    </ApolloProvider>
  );
};
export default App;
