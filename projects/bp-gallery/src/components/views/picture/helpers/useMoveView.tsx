import { useCallback } from 'react';

// This hook was extracted here to enable testing for
// different position changes
export const useMoveView = ({
  prevPos,
  setZoomLevel,
  setViewport,
  imageRef,
}: {
  prevPos: React.MutableRefObject<{
    x: number;
    y: number;
  } | null>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
}) => {
  const moveView = useCallback(
    (curPos: { x: number; y: number }) => {
      // setters are run async, so prevPos.current will be overwritten inside
      const prevPosCached = prevPos.current;
      setZoomLevel(zoomLevel => {
        let diff = {
          x: 0,
          y: 0,
        };
        if (prevPosCached !== null) {
          // We need the zoom level here, but since we can't have it as a callback dependency,
          // we have to use a workaround
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
          setViewport(viewport => {
            const x =
              ratio.x < 1
                ? 0
                : Math.max(
                    Math.min(
                      viewport.x + diff.x,
                      (imgRect.width - parentRect.width) / (2 * zoomLevel)
                    ),
                    (-imgRect.width + parentRect.width) / (2 * zoomLevel)
                  );
            const y =
              ratio.y < 1
                ? 0
                : Math.max(
                    Math.min(
                      viewport.y + diff.y,
                      (imgRect.height - parentRect.height) / (2 * zoomLevel)
                    ),
                    (-imgRect.height + parentRect.height) / (2 * zoomLevel)
                  );
            return {
              x,
              y,
            };
          });
        }

        return zoomLevel;
      });
    },
    [setZoomLevel, setViewport, prevPos, imageRef]
  );

  return moveView;
};
