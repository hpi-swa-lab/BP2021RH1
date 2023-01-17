import React, { lazy } from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import { TagType } from '../types/additionalFlatTypes';

const App = lazy(() => import('./App'));
const Demo = lazy(() => import('../prototypes/demo'));
const TimeLineDemo = lazy(() => import('../prototypes/timeline-demo'));
const CollectionCuratingView = lazy(
  () => import('./views/collection-curating/CollectionCuratingView')
);
const TagTableView = lazy(() => import('./views/tag-table/TagTableView'));
const PictureView = lazy(() => import('./views/picture/PictureView'));
const UnverifiedCommentsView = lazy(
  () => import('./views/unverified-comments/UnverifiedCommentsView')
);
const BrowseView = lazy(() => import('./views/browse/BrowseView'));
const SearchView = lazy(() => import('./views/search/SearchView'));
const UploadsView = lazy(() => import('./views/uploads/UploadsView'));
const LatestPicturesView = lazy(() => import('./views/latest-pictures/LatestPicturesView'));
const BulkEditView = lazy(() => import('./views/bulk-edit/BulkEditView'));
const StartView = lazy(() => import('./views/start/StartView'));
const ArchiveView = lazy(() => import('./views/archives/ArchiveView'));
const ArchiveEditView = lazy(() => import('./views/archives/ArchiveEditView'));
const ProtectedRoute = lazy(() => import('./common/ProtectedRoute'));
const TermsOfServiceView = lazy(() => import('./views/terms-of-service/TermsOfServiceView'));

export const FALLBACK_PATH = '/start';

const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: '/start',
        render: () => {
          return <StartView />;
        },
        exact: true,
      },
      {
        path: '/latest',
        render: () => {
          return <LatestPicturesView />;
        },
        exact: true,
      },
      {
        path: '/browse/:path+',
        // see https://stackoverflow.com/a/56162747 for details on the '+' in the path
        render: ({ match }: RouteConfigComponentProps<{ path: '' }>) => {
          const browseParams = match.params.path.split('/');
          return <BrowseView path={browseParams} />;
        },
      },
      {
        path: '/search',
        render: () => {
          return <SearchView />;
        },
        exact: true,
      },
      {
        path: '/uploads-overview',
        render: () => {
          return <UploadsView />;
        },
        exact: true,
      },
      {
        path: '/comment-overview',
        render: () => {
          return <UnverifiedCommentsView />;
        },
        exact: true,
      },
      {
        path: '/picture/:id',
        render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
          return <PictureView initialPictureId={match.params.id} />;
        },
      },
      {
        path: '/bulk-edit/:ids',
        render: ({ match }: RouteConfigComponentProps<{ ids: '' }>) => {
          return (
            <ProtectedRoute>
              <BulkEditView pictureIds={match.params.ids.split(',')} />
            </ProtectedRoute>
          );
        },
      },
      {
        path: '/tags/keywords',
        render: () => {
          return <TagTableView type={TagType.KEYWORD} />;
        },
      },
      {
        path: '/tags/locations',
        render: () => {
          return <TagTableView type={TagType.LOCATION} />;
        },
      },
      {
        path: '/tags/people',
        render: () => {
          return <TagTableView type={TagType.PERSON} />;
        },
      },
      {
        path: '/collections-overview',
        render: () => {
          return <CollectionCuratingView />;
        },
      },
      {
        path: '/terms-of-service',
        render: () => {
          return <TermsOfServiceView />;
        },
      },
      {
        path: '/prototypes/demo',
        render: () => {
          return <Demo />;
        },
      },
      {
        path: '/prototypes/timeline-demo',
        render: () => {
          return <TimeLineDemo />;
        },
      },
      {
        path: '/archives/:id/edit',
        render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
          return (
            <ProtectedRoute redirectPath={`/archives/${match.params.id}`}>
              <ArchiveEditView archiveId={match.params.id} />
            </ProtectedRoute>
          );
        },
      },
      {
        path: '/archives/:id',
        render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
          return <ArchiveView archiveId={match.params.id} />;
        },
      },

      {
        // fallback component for unmatched routes
        render: () => {
          return <Redirect to={FALLBACK_PATH} />;
        },
      },
    ],
  },
];

export default routes;
