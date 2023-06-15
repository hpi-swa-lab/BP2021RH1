import { useCallback } from 'react';

export const useOnChangeSetter = <T>(setter: (value: T) => void) => {
  return useCallback(
    (event: { target: { value: T } }) => {
      setter(event.target.value);
    },
    [setter]
  );
};
