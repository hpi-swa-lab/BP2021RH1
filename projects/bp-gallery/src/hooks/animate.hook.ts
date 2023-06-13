import { useEffect, useMemo, useState } from 'react';

const EPSILON = 0.001;

export const useAnimate = (target: number, step: number) => {
  const [current, setCurrent] = useState(target);

  const { updateConfig, jumpTo } = useMemo(
    () => createUpdater(target, step, setCurrent),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    updateConfig(target, step);
  }, [updateConfig, target, step]);

  return [current, jumpTo] as const;
};

const createUpdater = (
  initial: number,
  initialStep: number,
  setCurrent: (value: number) => void
) => {
  let current = initial;
  let target = initial;
  let step = initialStep;

  const set = (value: number) => {
    setCurrent(value);
    current = value;
  };

  const update = () => {
    if (target === current) {
      return;
    }
    if (Math.abs(target - current) <= EPSILON) {
      set(target);
    } else {
      set(current + (target - current) * step);
      requestAnimationFrame(update);
    }
  };

  const updateConfig = (newTarget: number, newStep: number) => {
    target = newTarget;
    step = newStep;
    update();
  };

  const jumpTo = (value: number) => {
    set(value);
    target = value;
  };

  return {
    updateConfig,
    jumpTo,
  };
};
