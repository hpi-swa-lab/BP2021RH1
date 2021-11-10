import React from 'react';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import App from './App';
import Demo from './prototypes/demo';
import TimeLineDemo from './prototypes/timeline-demo';
import GalleryView from './views/gallery/GalleryView';

const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: '/browse',
        render: () => {
          return <GalleryView target='browse' />;
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
