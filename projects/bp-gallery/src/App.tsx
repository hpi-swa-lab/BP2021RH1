import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import TopBar from './components/TopBar';
import './App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

const App = ({ route }: RouteConfigComponentProps) => {
  return (
    <div className='App'>
      <TopBar />
      {renderRoutes(route?.routes)}
    </div>
  );
};
export default App;
