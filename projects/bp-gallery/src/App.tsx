import React from "react";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import Navigation from "./Navigation";
import "./App.scss";

const App = ({ route }: RouteConfigComponentProps) => (
  <div className="App">
    <Navigation />
    { renderRoutes(route.routes) }
  </div>
);

export default App;
