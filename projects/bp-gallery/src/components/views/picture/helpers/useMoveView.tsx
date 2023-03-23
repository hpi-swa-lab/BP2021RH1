import { useCallback } from 'react';

// This hook was extracted here to enable testing for
// different position changes
export const useMoveView = ({
  prevPos,
  setViewport,
  imageRef,
}: {
  prevPos: React.MutableRefObject<{
    x: number;
    y: number;
  } | null>;
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number; zoomLevel: number }>>;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
}) => {
  const moveView = useCallback(
    (curPos: { x: number; y: number }) => {
      // setters are run async, so prevPos.current will be overwritten inside
      const prevPosCached = prevPos.current;
      setViewport(({ x, y, zoomLevel }) => {
        let diff = {
          x: 0,
          y: 0,
        };
        if (prevPosCached !== null) {
          diff = {
            x: (curPos.x - prevPosCached.x) / zoomLevel,
            y: (curPos.y - prevPosCached.y) / zoomLevel,
          };
        }
        if (imageRef.current?.parentElement) {
          const imgRect = imageRef.current.getBoundingClientRect();
          const parentRect = imageRef.current.parentElement.getBoundingClientRect();
          const ratio = {
            x: imgRect.width / parentRect.width,
            y: imgRect.height / parentRect.height,
          };
          const move = (position: number, direction: 'x' | 'y', size: 'width' | 'height') =>
            ratio[direction] < 1
              ? 0
              : Math.max(
                  Math.min(
                    position + diff[direction],
                    (imgRect[size] - parentRect[size]) / (2 * zoomLevel)
                  ),
                  (-imgRect[size] + parentRect[size]) / (2 * zoomLevel)
                );
          x = move(x, 'x', 'width');
          y = move(y, 'y', 'height');
        }
        return { x, y, zoomLevel };
      });
    },
    [setViewport, prevPos, imageRef]
  );

  return moveView;
};
