import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ZoomWrapper.scss';

const MAX_ZOOM = 5.0;
const MIN_ZOOM = 1.0;

const ZoomWrapper = ({ blockScroll, children }: { blockScroll: boolean; children: any }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [viewport, setViewport] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const pointers = useRef<PointerEvent[]>([]);
  const prevPos = useRef<{ x: number; y: number } | null>(null);
  const prevDiff = useRef<number>(-1);

  const moveView = useCallback(
    (curPos: { x: number; y: number }) => {
      setZoomLevel(zoomLevel => {
        let diff = {
          x: 0,
          y: 0,
        };
        if (prevPos.current !== null) {
          // We need the zoom level here, but since we can't have it as a callback dependency,
          // we have to use a workaround
          diff = {
            x: (curPos.x - prevPos.current.x) / zoomLevel,
            y: (curPos.y - prevPos.current.y) / zoomLevel,
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
    [setZoomLevel, setViewport]
  );

  const onScroll = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setZoomLevel(previousZoom => {
        return Math.min(Math.max(previousZoom - event.deltaY / 1000, MIN_ZOOM), MAX_ZOOM);
      });
      moveView({
        x: event.clientX,
        y: event.clientY,
      });
    },
    [setZoomLevel, moveView]
  );

  const onPointerDown = useCallback((evt: PointerEvent) => {
    pointers.current = pointers.current.concat([evt]);
  }, []);

  const onPointerUp = useCallback((evt: PointerEvent) => {
    pointers.current = [];
    prevDiff.current = -1;
    prevPos.current = null;
  }, []);

  const onPointerMove = useCallback(
    (evt: PointerEvent) => {
      if (pointers.current.length <= 0) {
        return;
      }
      for (let i = 0; i < pointers.current.length; i++) {
        if (evt.pointerId === pointers.current[i].pointerId) {
          pointers.current[i] = evt;
          break;
        }
      }

      evt.preventDefault();
      evt.stopPropagation();

      const curPos = {
        x: pointers.current.reduce((prev, cur) => prev + cur.clientX, 0) / pointers.current.length,
        y: pointers.current.reduce((prev, cur) => prev + cur.clientY, 0) / pointers.current.length,
      };

      if (pointers.current.length === 2) {
        const curDiff = Math.sqrt(
          Math.pow(pointers.current[0].clientX - pointers.current[1].clientX, 2) +
            Math.pow(pointers.current[0].clientY - pointers.current[1].clientY, 2)
        );

        setZoomLevel(zoomLevel => {
          if (prevDiff.current > 0) {
            zoomLevel = Math.max(
              MIN_ZOOM,
              Math.min(zoomLevel * (curDiff / prevDiff.current), MAX_ZOOM)
            );
          }
          return zoomLevel;
        });
        prevDiff.current = curDiff;
      }

      moveView(curPos);

      prevPos.current = curPos;
    },
    [moveView]
  );

  const resetAll = useCallback(() => {
    if (containerRef.current) {
      const container: HTMLDivElement | null =
        containerRef.current.querySelector('.picture-wrapper');
      container?.removeEventListener('wheel', onScroll);
      container?.removeEventListener('pointerdown', onPointerDown);
      container?.removeEventListener('pointerup', onPointerUp);
      container?.removeEventListener('pointercancel', onPointerUp);
      container?.removeEventListener('pointermove', onPointerMove);
    }
    if (imageRef.current) {
      const image = imageRef.current;
      setZoomLevel(1);
      setViewport({ x: 0, y: 0 });
      image.style.transform = '';
    }
  }, [onScroll, onPointerDown, onPointerUp, onPointerMove]);

  const addAll = useCallback(() => {
    if (containerRef.current) {
      const container: HTMLDivElement | null =
        containerRef.current.querySelector('.picture-wrapper');
      container?.addEventListener('wheel', onScroll);
      container?.addEventListener('pointerdown', onPointerDown);
      container?.addEventListener('pointerup', onPointerUp);
      container?.addEventListener('pointercancel', onPointerUp);
      container?.addEventListener('pointermove', onPointerMove);
    }
  }, [onScroll, onPointerDown, onPointerUp, onPointerMove]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const image: HTMLImageElement | null =
      containerRef.current.querySelector('.picture-container img');
    if (image) {
      imageRef.current = image;
    }

    if (blockScroll) {
      addAll();
    } else {
      resetAll();
    }

    return () => {
      resetAll();
    };
  }, [imageRef, containerRef, blockScroll, addAll, resetAll]);

  useEffect(() => {
    if (!imageRef.current) {
      return;
    }
    imageRef.current.style.transform = `scale(${zoomLevel}) translate(${viewport.x}px, ${viewport.y}px)`;
  }, [zoomLevel, viewport, imageRef]);

  return (
    <div className='zoom-wrapper' ref={containerRef}>
      {children}
    </div>
  );
};

export default ZoomWrapper;
