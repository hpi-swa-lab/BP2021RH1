import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { renderRoutes } from 'react-router-config';
import { buildHttpLink, mergeByRef, mergeByRefWrappedInData } from '../helpers/app-helpers';
import { picturesKeyArgsFunction } from '../hooks/get-pictures.hook';
import './App.scss';
import ScrollContainer from './common/ScrollContainer';
import AlertProvider from './provider/AlertProvider';
import AuthProvider from './provider/AuthProvider';
import ClipboardEditorProvider from './provider/ClipboardEditorProvider';
import DialogProvider from './provider/DialogProvider';
import ExhibitionProvider from './provider/ExhibitionProvider';
import { GrowthBookProvider } from './provider/GrowthBookProvider';
import { MobileProvider } from './provider/MobileProvider';
import { MuiThemeProvider } from './provider/MuiThemeProvider';
import { ScrollProvider } from './provider/ScrollProvider';
import routes from './routes';
import BottomBar from './top-and-bottom-bar/BottomBar';
import TopBar from './top-and-bottom-bar/TopBar';
import { FoldoutStatusProvider } from './views/location-curating/FoldoutStatusProvider';

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
          'Exhibition',
          'ExhibitionPicture',
          'ExhibitionSection',
          'ExhibitionSource',
          'FaceTag',
          'KeywordTag',
          'Link',
          'LocationTag',
          'ParameterizedPermission',
          'PersonTag',
          'Picture',
          'TimeRangeTag',
          'UploadFile',
        ].map(entity => [entity, { merge: true }])
      ),
      Query: {
        fields: {
          pictures: {
            keyArgs: picturesKeyArgsFunction,
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
            <FoldoutStatusProvider>
              <DialogProvider>
                <MobileProvider>
                  <div className='App'>
                    <ClipboardEditorProvider>
                      <GrowthBookProvider>
                        <ScrollProvider useWindow>
                          <ExhibitionProvider>
                            <TopBar />
                            <ScrollContainer>{renderRoutes(routes)}</ScrollContainer>
                            <BottomBar />
                          </ExhibitionProvider>
                        </ScrollProvider>
                      </GrowthBookProvider>
                    </ClipboardEditorProvider>
                  </div>
                </MobileProvider>
              </DialogProvider>
            </FoldoutStatusProvider>
          </AuthProvider>
        </AlertProvider>
      </MuiThemeProvider>
    </ApolloProvider>
  );
};
export default App;
