import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { useMoveView } from '../helpers/useMoveView';
import './ZoomWrapper.scss';

const MAX_ZOOM = 30.0;
const MIN_ZOOM = 1.0;
const DEFAULT_ZOOM = 1.0;
const ZOOM_RATE = -0.001;

const ZoomWrapper = ({
  blockScroll,
  pictureId, // This is used to determine when a picture change has happened
  children,
}: PropsWithChildren<{
  blockScroll: boolean;
  pictureId: string;
}>) => {
  const [viewport, setViewport] = useState<{ x: number; y: number; zoomLevel: number }>({
    x: 0,
    y: 0,
    zoomLevel: DEFAULT_ZOOM,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const pointers = useRef<PointerEvent[]>([]);
  const prevPos = useRef<{ x: number; y: number } | null>(null);
  const prevDiff = useRef<number>(-1);

  const moveView = useMoveView({
    prevPos,
    setViewport,
    imageRef,
  });

  const resetViewport = useCallback(() => {
    setViewport({ x: 0, y: 0, zoomLevel: 1 });
  }, []);

  useEffect(() => {
    resetViewport();
  }, [pictureId, resetViewport]);

  const onScroll = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setViewport(({ x, y, zoomLevel }) => ({
        x,
        y,
        zoomLevel: Math.min(
          Math.max(zoomLevel * Math.exp(event.deltaY * ZOOM_RATE), MIN_ZOOM),
          MAX_ZOOM
        ),
      }));
      moveView({
        x: event.clientX,
        y: event.clientY,
      });
    },
    [moveView]
  );

  const onPointerDown = useCallback((evt: PointerEvent) => {
    pointers.current = pointers.current.concat([evt]);
    evt.preventDefault();
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
        const curDiff = Math.hypot(
          pointers.current[0].clientX - pointers.current[1].clientX,
          pointers.current[0].clientY - pointers.current[1].clientY
        );

        // setters are run async, so prevDiff.current will be overwritten inside
        const prevDiffCached = prevDiff.current;
        setViewport(({ x, y, zoomLevel }) => {
          if (prevDiffCached > 0) {
            zoomLevel = Math.max(
              MIN_ZOOM,
              Math.min(zoomLevel * (curDiff / prevDiffCached), MAX_ZOOM)
            );
          }
          return { x, y, zoomLevel };
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
      container?.removeEventListener('pointerleave', onPointerUp);
      container?.removeEventListener('pointermove', onPointerMove);
    }
    if (imageRef.current) {
      const image = imageRef.current;
      resetViewport();
      image.style.transform = '';
    }
  }, [onScroll, onPointerDown, onPointerUp, onPointerMove, resetViewport]);

  const addAll = useCallback(() => {
    if (containerRef.current) {
      const container: HTMLDivElement | null =
        containerRef.current.querySelector('.picture-wrapper');
      container?.addEventListener('wheel', onScroll);
      container?.addEventListener('pointerdown', onPointerDown);
      container?.addEventListener('pointerup', onPointerUp);
      container?.addEventListener('pointercancel', onPointerUp);
      container?.addEventListener('pointerleave', onPointerUp);
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
    const { x, y, zoomLevel } = viewport;
    imageRef.current.style.transform = `scale(${zoomLevel}) translate(${x}px, ${y}px)`;
  }, [viewport, imageRef]);

  return (
    <div className='zoom-wrapper' ref={containerRef}>
      {children}
    </div>
  );
};

export default ZoomWrapper;
