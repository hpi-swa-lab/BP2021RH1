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
        path: '/browse/:path',
        render: (props: RouteConfigComponentProps) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const path = props.location.pathname.split('/').slice(2);
          return <GalleryView target='browse' path={path} />;
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
        path: '/search/:query',
        render: props => {
          return <GalleryView target='search' searchParams={props.match.params.query} />;
        },
      },
      {
        path: '/picture/:id',
        render: props => {
          return <PictureView pictureId={props.match.params.id} thumbnailMode={false} />;
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
