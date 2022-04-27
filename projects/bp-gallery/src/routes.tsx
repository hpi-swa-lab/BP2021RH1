import React from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import App from './App';
import Demo from './prototypes/demo';
import TimeLineDemo from './prototypes/timeline-demo';
import GalleryView from './views/gallery/GalleryView';
import PictureView from './views/picture/PictureView';
import Map from './prototypes/Map/Map';

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
        path: '/browse/latest',
        render: () => {
          return <GalleryView target='browse/latest' />;
        },
        exact: true,
      },
      {
        path: '/browse/latest/:path+',
        render: ({ match }: RouteConfigComponentProps<{ path: '' }>) => {
          const browseParams = match.params.path.split('/');
          return <GalleryView target='browse/latest' path={browseParams} />;
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
          return <GalleryView target='main' />;
        },
        exact: true,
      },
      {
        path: '/main',
        render: () => {
          return <GalleryView target='main' />;
        },
        exact: true,
      },
      {
        path: '/picture/:id',
        render: ({ match }: RouteConfigComponentProps<{ id: '' }>) => {
          return (
            <PictureView
              pictureId={match.params.id}
              isInitialThumbnail={false}
              initialParams={{ sideBarOpen: true }}
            />
          );
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
        path: '/prototypes/map',
        component: Map,
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
