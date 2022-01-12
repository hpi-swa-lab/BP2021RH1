import React from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import App from './App';
import Demo from './prototypes/demo';
import TimeLineDemo from './prototypes/timeline-demo';
import GalleryView from './views/gallery/GalleryView';
import PictureView from './views/picture/PictureView';

const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: '/browse',
        render: () => {
          return <GalleryView target='browse' />;
        },
        exact: true,
      },
      {
        path: '/browse/:path+',
        // see https://stackoverflow.com/a/56162747 for details on the '+' in the path
        render: ({ match }: RouteConfigComponentProps<{ path: '' }>) => {
          const browseParams = match.params.path.split('/');
          return <GalleryView target='browse' path={browseParams} />;
        },
      },
      {
        path: '/search',
        render: () => {
          return <GalleryView target='search' />;
        },
        exact: true,
      },
      {
        path: '/picture/:id',
        render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
          return <PictureView pictureId={match.params.id} initialThumbnail={false} />;
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
