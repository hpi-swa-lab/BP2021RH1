import React from "react";
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Home from "./Home";
import Navigation from "./Navigation";

import Demo from './prototypes/demo/Demo';

import './App.scss';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Navigation />
      <Switch>
        <Route path="/prototypes/demo" component={ Demo }/>
        <Route component={ Home } />
      </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;
