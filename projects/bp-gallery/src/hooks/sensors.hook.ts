import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

export const useMouseAndTouchSensors = () => {
  return useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
};
