import React, { ReactElement, useEffect, useRef } from "react";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import Navigation from "./Navigation";
import "./App.scss";
import { drawBackground, roundRect } from "./helpers";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawBackground(ctx);
  }, []);

  return <canvas ref={canvasRef} id='background-anim' width="1920" height="1080"></canvas>;
}

const App = ({ route }: RouteConfigComponentProps) => (
  <div className="App">
    <AnimatedBackground />
    <Navigation />
    { renderRoutes(route.routes) }
  </div>
);

export default App;
