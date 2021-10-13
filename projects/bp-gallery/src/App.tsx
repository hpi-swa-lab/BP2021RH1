import React from "react";
import { renderRoutes, RouteConfig } from "react-router-config";
import Navigation from "./Navigation";
import "./App.scss";

const App = ({ route }: RouteConfig) => (
  <div className="App">
    <Navigation />
    { renderRoutes(route.routes) }
  </div>
);

export default App;
