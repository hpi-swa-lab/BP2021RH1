import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { renderRoutes } from 'react-router-config';
import { buildHttpLink, mergeByRef, mergeByRefWrappedInData } from '../helpers/app-helpers';
import './App.scss';
import AlertProvider from './provider/AlertProvider';
import AuthProvider from './provider/AuthProvider';
import ClipboardEditorProvider from './provider/ClipboardEditorProvider';
import DialogProvider from './provider/DialogProvider';
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

const growthbook = new GrowthBook({
  apiHost: 'http://localhost:4100',
  clientKey: 'sdk-8ya8rFZ7rGy4tR',
  enableDevMode: true,
  onFeatureUsage: (featureKey, result) => {
    console.log('feature', featureKey, 'has value', result.value);
  },
  trackingCallback: (experiment, result) => {
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push(['trackEvent', 'ExperimentViewed', experiment.key, 'v' + String(result.variationId)]);
  },
});

const App = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    growthbook.loadFeatures({ autoRefresh: true, timeout: 2000 });
    growthbook.setAttributes({}); //TODO: replace with real targeting attributes

    let visitor_id: string;
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push([
      function (this: any) {
        visitor_id = this.getVisitorId();
        growthbook.setAttributes({ ...growthbook.getAttributes(), id: visitor_id });
      },
    ]);

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
              <GrowthBookProvider growthbook={growthbook}>
                <div className='App'>
                  <ClipboardEditorProvider>
                    <TopBar isMobile={isMobile} />
                    {renderRoutes(routes)}
                    {isMobile && <NavigationBar isMobile={true} />}
                  </ClipboardEditorProvider>
                </div>
              </GrowthBookProvider>
            </StorageProvider>
          </DialogProvider>
        </AuthProvider>
      </AlertProvider>
    </ApolloProvider>
  );
};
export default App;
