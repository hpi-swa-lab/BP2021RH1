import React from 'react';
import Demo from './Demo';

const DemoModule = () => (
    <div>Demo Module</div>
);

export default {
    routeProps: {
        path: '/prototypes/demo',
        component: Demo
    },
    name: 'Demo',
}