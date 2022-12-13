import React from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import App from './App';
import Demo from '../prototypes/demo';
import TimeLineDemo from '../prototypes/timeline-demo';
import CollectionCuratingView from './views/collection-curating/CollectionCuratingView';
import TagTableView from './views/tag-table/TagTableView';
import PictureView from './views/picture/PictureView';
import UnverifiedCommentsView from './views/unverified-comments/UnverifiedCommentsView';
import { TagType } from '../types/additionalFlatTypes';
import BrowseView from './views/browse/BrowseView';
import SearchView from './views/search/SearchView';
import UploadsView from './views/uploads/UploadsView';
import LatestPicturesView from './views/latest-pictures/LatestPicturesView';
import BulkEditView from './views/bulk-edit/BulkEditView';
import ArchiveView from './views/archives/ArchiveView';

export const FALLBACK_PATH = '/browse';

const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: '/browse',
        render: () => {
          return <BrowseView />;
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
          return <BulkEditView pictureIds={match.params.ids.split(',')} />;
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
        path: '/prototypes/demo',
        component: Demo,
      },
      {
        path: '/prototypes/timeline-demo',
        component: TimeLineDemo,
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
