import React, { useEffect, useRef } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import Navigation from './Navigation';
import './App.scss';
import { drawBackground } from './helpers';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    drawBackground(ctx);
  }, []);

  return <canvas ref={canvasRef} id='background-anim' width='1920' height='1080' />;
};

const App = ({ route }: RouteConfigComponentProps) => (
  <div className='App'>
    <AnimatedBackground />
    <Navigation />
    {renderRoutes(route?.routes)}
  </div>
);

export default App;
