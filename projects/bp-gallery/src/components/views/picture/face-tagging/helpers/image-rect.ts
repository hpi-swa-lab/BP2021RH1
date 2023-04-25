import { useCallback, useEffect, useMemo, useState } from 'react';

type Rect = { x: number; y: number; width: number; height: number };

export const useImageRect = (img: HTMLImageElement | null) => {
  const [rect, setRect] = useState(() => (img ? computeRect(img) : null));

  const recompute = useCallback((img: HTMLImageElement) => {
    setRect(computeRect(img));
  }, []);

  // The IntersectionObserver (see below) can only observe
  // elements positioned relative to its given root.
  // Since position: fixed; breaks that hierarchy and
  // PictureView is sometimes positioned like so, we can't
  // just use document.documentElement or similar.
  // Instead, we use the closest ancestor with position: fixed.
  const root = useClosestPositionFixedAncestor(img);

  // recompute when img or root changes
  useEffect(() => {
    if (!img || !root) {
      setRect(null);
      return;
    }
    recompute(img);
  }, [img, root, recompute]);

  // observe root too, so the IntersectionObserver below always has correct margins
  useResizeObserver(
    img,
    useMemo(() => [root], [root]),
    recompute
  );

  useStyleObserver(img, recompute);

  // This should be more general than the MutationObserver above
  // (i. e. it catches position changes which the MutationObserver
  // doesn't, e. g. the img sliding horizontally because the PictureInfo
  // is being hidden), but in practice, using a MutationObserver in
  // addition leads to quicker and thus smoother updates, so we keep it.
  useIntersectionObserver(img, root, rect, recompute);

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

const useClosestPositionFixedAncestor = (child: HTMLElement | null) => {
  return useMemo(() => {
    let current = child;
    while (current) {
      if (getComputedStyle(current).position === 'fixed') {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }, [child]);
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

const useIntersectionObserver = <Subject extends HTMLElement>(
  subject: Subject | null,
  root: HTMLElement | null,
  currentRect: Rect | null,
  onChange: (subject: Subject) => void
) => {
  // Use an IntersectionObserver to watch for position changes.
  // This works by constructing an IntersectionObserver that
  // watches for changes in the intersection rectangle of the
  // subject and the rectangle it currently occupies. When the subject
  // moves, its intersection rectangle with the given rectangle
  // changes size. Since we provide a threshold near 1 for the
  // intersection ratio, a slight change in the size will trigger
  // our given callback.
  useEffect(() => {
    if (!subject || !root || !currentRect) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const subjectRect = subject.getBoundingClientRect();

    // Compute the rectangle that the subject currently occupies,
    // relative to root's rectangle. Negative margins are inwards, so
    // right and bottom are the other way around.
    const rootMargin = [
      rootRect.top - subjectRect.top,
      subjectRect.right - rootRect.right,
      subjectRect.bottom - rootRect.bottom,
      rootRect.left - subjectRect.left,
    ]
      .map(margin => `${margin}px`)
      .join(' ');

    const { width, height } = subjectRect;
    // account for one pixel error on each side due to subpixel rounding issues
    const onePixelError = (2 * (width + height)) / (width * height);
    const threshold = isFinite(onePixelError) ? 1 - onePixelError : 1;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].intersectionRatio >= threshold) {
          // ignore updates that don't actually
          // change the intersectionRatio
          return;
        }
        onChange(subject);
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );
    observer.observe(subject);

    return () => {
      observer.disconnect();
    };
  }, [subject, root, currentRect, onChange]);
};
