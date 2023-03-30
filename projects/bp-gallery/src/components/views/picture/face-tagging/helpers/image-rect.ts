import { useCallback, useEffect, useState } from 'react';

export const useImageRect = (img: HTMLImageElement | null) => {
  const computeRect = useCallback((img: HTMLImageElement) => {
    const { x, y, width, height } = img.getBoundingClientRect();
    const { naturalHeight, naturalWidth } = img;
    const ratio = naturalWidth / naturalHeight;
    const realWidth = isNaN(ratio) || ratio > 1 ? width : height * ratio;
    const realHeight = isNaN(ratio) || ratio < 1 ? height : width / ratio;
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

  const recompute = useCallback(
    (img: HTMLImageElement) => {
      setRect(computeRect(img));
    },
    [computeRect]
  );

  useEffect(() => {
    if (!img) {
      setRect(null);
      return;
    }
    recompute(img);

    const resizeObserver = new ResizeObserver(() => {
      recompute(img);
    });
    resizeObserver.observe(img);

    const mutationObserver = new MutationObserver(() => {
      recompute(img);
    });
    mutationObserver.observe(img, {
      attributeFilter: ['style'],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [img, root, recompute]);

  return rect;
};
