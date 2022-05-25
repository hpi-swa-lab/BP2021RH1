import React from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import App from './App';
import Demo from '../prototypes/demo';
import TimeLineDemo from '../prototypes/timeline-demo';
import CollectionsOverview from './views/collection-curating/CollectionsOverview';
import TagOverview from './views/collection-curating/TagOverview';
import PictureView from './views/picture/PictureView';
import CommentOverview from './views/unverified-comments/CommentOverview';
import { TagType } from '../types/additionalFlatTypes';
import BrowseView from './views/browse/BrowseView';
import SearchView from './views/search/SearchView';
import UploadsView from './views/uploads/UploadsView';

const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: '/browse',
        render: () => {
          return <BrowseView communityView={false} />;
        },
        exact: true,
      },
      {
        path: '/browse/latest',
        render: () => {
          return <BrowseView communityView={true} />;
        },
        exact: true,
      },
      {
        path: '/browse/latest/:path+',
        render: ({ match }: RouteConfigComponentProps<{ path: '' }>) => {
          const browseParams = match.params.path.split('/');
          return <BrowseView communityView={true} path={browseParams} />;
        },
        exact: true,
      },
      {
        path: '/browse/:path+',
        // see https://stackoverflow.com/a/56162747 for details on the '+' in the path
        render: ({ match }: RouteConfigComponentProps<{ path: '' }>) => {
          const browseParams = match.params.path.split('/');
          return <BrowseView communityView={false} path={browseParams} />;
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
          return <CommentOverview />;
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
        path: '/tags/keywords',
        render: () => {
          return <TagOverview type={TagType.KEYWORD} />;
        },
      },
      {
        path: '/tags/locations',
        render: () => {
          return <TagOverview type={TagType.LOCATION} />;
        },
      },
      {
        path: '/tags/people',
        render: () => {
          return <TagOverview type={TagType.PERSON} />;
        },
      },
      {
        path: '/collections-overview',
        render: () => {
          return <CollectionsOverview />;
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
        // fallback component for unmatched routes
        render: () => {
          return <Redirect to='/browse' />;
        },
      },
    ],
  },
];

export default routes;
