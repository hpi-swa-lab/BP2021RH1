import { isEqual } from 'lodash';
import { useEffect, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';

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
  const newMousePosition: MousePosition = {
    client: [clientX, clientY],
  };
  if (isEqual(currentMousePosition, newMousePosition)) {
    return;
  }
  currentMousePosition = newMousePosition;
  for (const listener of Array.from(listeners)) {
    listener(currentMousePosition);
  }
});

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState(currentMousePosition);

  const listener = useCallback((position: MousePosition) => {
    // use flushSync to ensure state is up-to-date
    // when events fire quickly in succession, e. g. in cypress
    flushSync(() => {
      setMousePosition(position);
    });
  }, []);

  useEffect(() => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [listener]);

  return mousePosition;
};
