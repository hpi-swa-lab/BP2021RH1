import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export const useMouseInElement = (element: HTMLElement | null | undefined) => {
  const [inElement, setInElement] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }
    // use flushSync to ensure state is up-to-date
    // when events fire quickly in succession, e. g. in cypress
    const over = () => {
      flushSync(() => {
        setInElement(true);
      });
    };
    const out = () => {
      flushSync(() => {
        setInElement(false);
      });
    };
    element.addEventListener('mouseover', over);
    element.addEventListener('mouseout', out);
    return () => {
      element.removeEventListener('mouseover', over);
      element.removeEventListener('mouseout', out);
    };
  }, [element]);

  return inElement;
};
