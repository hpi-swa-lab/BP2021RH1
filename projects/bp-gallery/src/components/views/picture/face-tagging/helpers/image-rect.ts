import { useCallback, useEffect, useState } from 'react';

export const useImageRect = (img: HTMLImageElement | null) => {
  const computeRect = useCallback((img: HTMLImageElement) => {
    const { x, y, width, height } = img.getBoundingClientRect();
    const { naturalHeight, naturalWidth } = img;
    const ratio = naturalWidth / naturalHeight;
    const realWidth = ratio > 1 ? width : height * ratio;
    const realHeight = ratio < 1 ? height : width / ratio;
    const realX = x + (width - realWidth) / 2;
    const realY = y + (height - realHeight) / 2;
    return {
      x: realX,
      y: realY,
      width: realWidth,
      height: realHeight,
    };
  }, []);

  const [rect, setRect] = useState(() => (img ? computeRect(img) : null));

  useEffect(() => {
    if (!img) {
      setRect(null);
      return;
    }
    setRect(computeRect(img));

    const resizeObserver = new ResizeObserver(() => {
      setRect(computeRect(img));
    });
    resizeObserver.observe(img);

    const mutationObserver = new MutationObserver(() => {
      setRect(computeRect(img));
    });
    mutationObserver.observe(img, {
      attributeFilter: ['style'],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [img, computeRect]);

  return rect;
};
