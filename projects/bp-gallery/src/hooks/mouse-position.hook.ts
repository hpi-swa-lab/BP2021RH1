import { useEffect, useState } from 'react';

type Position = [number, number];
type MousePosition = {
  client: Position;
};
const listeners = new Set<(position: MousePosition) => void>();

let currentMousePosition: MousePosition = {
  client: [0, 0],
};

window.addEventListener('mousemove', event => {
  const { clientX, clientY } = event;
  currentMousePosition = {
    client: [clientX, clientY],
  };
  for (const listener of Array.from(listeners)) {
    listener(currentMousePosition);
  }
});

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState(currentMousePosition);

  useEffect(() => {
    listeners.add(setMousePosition);
    return () => {
      listeners.delete(setMousePosition);
    };
  }, []);

  return mousePosition;
};
