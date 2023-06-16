import { useEffect, useState } from 'react';

type Listener = (visible: boolean) => void;
const listeners = new Map<Element, Listener[]>();

// the default root is the entire viewport
const intersectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const entryListeners = listeners.get(entry.target);
    if (!entryListeners) {
      continue;
    }
    for (const listener of entryListeners) {
      listener(entry.intersectionRatio > 0);
    }
  }
});

export const useElementIsVisible = (element: HTMLElement | null, stayVisible = false) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }
    intersectionObserver.observe(element);

    const listener = stayVisible
      ? (visible: boolean) => {
          if (visible) {
            setIsVisible(true);
          }
        }
      : setIsVisible;
    const elementListeners = listeners.get(element) ?? [];
    elementListeners.push(listener);
    listeners.set(element, elementListeners);

    return () => {
      intersectionObserver.unobserve(element);

      elementListeners.splice(elementListeners.indexOf(listener), 1);
      if (elementListeners.length === 0) {
        listeners.delete(element);
      }
    };
  }, [element, stayVisible]);

  return isVisible;
};
