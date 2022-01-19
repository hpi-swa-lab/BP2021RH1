import { RefObject, useEffect } from 'react';

const useBlockScroll = (containerRef: RefObject<HTMLDivElement>, thumbnailMode?: boolean) => {
  // Prevent wheel actions to propagate to perfect scrollbar of the picture grid view
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const container: HTMLDivElement = containerRef.current;
    const preventScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    if (!thumbnailMode) {
      container.addEventListener('wheel', preventScroll);
    } else {
      container.removeEventListener('wheel', preventScroll);
    }

    return () => {
      container.removeEventListener('wheel', preventScroll);
    };
  }, [containerRef, thumbnailMode]);
};

export default useBlockScroll;
