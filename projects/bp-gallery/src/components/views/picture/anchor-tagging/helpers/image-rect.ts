import { useCallback, useEffect, useMemo, useState } from 'react';

export type Rect = { x: number; y: number; width: number; height: number };

export const useImageRect = (img: HTMLImageElement | null, resizingParent: HTMLElement | null) => {
  const [rect, setRect] = useState(() => (img ? computeRect(img) : null));

  const recompute = useCallback((img: HTMLImageElement) => {
    setRect(computeRect(img));
  }, []);

  // recompute when img or root changes
  useEffect(() => {
    if (!img) {
      setRect(null);
      return;
    }
    recompute(img);
  }, [img, recompute]);

  // observe root too, so the IntersectionObserver below always has correct margins
  useResizeObserver(
    img,
    useMemo(() => [resizingParent], [resizingParent]),
    recompute
  );

  useStyleObserver(img, recompute);

  return rect;
};

const computeRect = (img: HTMLImageElement): Rect => {
  const { x, y, width, height } = img.getBoundingClientRect();
  const { naturalHeight, naturalWidth } = img;
  const naturalRatio = naturalWidth / naturalHeight;
  const containerRatio = width / height;
  const realWidth =
    isNaN(naturalRatio) || naturalRatio > containerRatio ? width : height * naturalRatio;
  const realHeight =
    isNaN(naturalRatio) || naturalRatio < containerRatio ? height : width / naturalRatio;
  const realX = x + (width - realWidth) / 2;
  const realY = y + (height - realHeight) / 2;
  return {
    x: realX,
    y: realY,
    width: realWidth,
    height: realHeight,
  };
};

const useResizeObserver = <Subject extends HTMLElement>(
  subject: Subject | null,
  additionalElements: (HTMLElement | null)[],
  onChange: (subject: Subject) => void
) => {
  useEffect(() => {
    if (!subject) {
      return;
    }
    const observer = new ResizeObserver(() => {
      onChange(subject);
    });
    for (const element of [subject, ...additionalElements]) {
      if (element) {
        observer.observe(element);
      }
    }
    return () => {
      observer.disconnect();
    };
  }, [subject, additionalElements, onChange]);
};

const useStyleObserver = <Subject extends HTMLElement>(
  subject: Subject | null,
  onChange: (subject: Subject) => void
) => {
  useEffect(() => {
    if (!subject) {
      return;
    }
    const observer = new MutationObserver(() => {
      onChange(subject);
    });
    observer.observe(subject, {
      attributeFilter: ['style'],
    });
    return () => {
      observer.disconnect();
    };
  }, [subject, onChange]);
};
