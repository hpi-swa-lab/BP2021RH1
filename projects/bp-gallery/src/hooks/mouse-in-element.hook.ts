import { useEffect, useState } from 'react';

export const useMouseInElement = (element: HTMLElement | null | undefined) => {
  const [inElement, setInElement] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }
    const over = () => {
      setInElement(true);
    };
    const out = () => {
      setInElement(false);
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
