import { useCallback, useEffect, useMemo, useState } from 'react';

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

  // The IntersectionObserver (see below) can only observe
  // elements positioned relative to its given root.
  // Since position: fixed; breaks that hierarchy and
  // PictureView is sometimes positioned like so, we can't
  // just use document.documentElement or similar.
  // Instead, we walk upwards from img to find the first
  // ancestor with position: fixed.
  const root = useMemo(() => {
    let current: HTMLElement | null = img;
    while (current) {
      if (getComputedStyle(current).position === 'fixed') {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }, [img]);

  useEffect(() => {
    if (!img || !root) {
      setRect(null);
      return;
    }
    recompute(img);

    const resizeObserver = new ResizeObserver(() => {
      recompute(img);
    });
    resizeObserver.observe(img);
    // observe root, so the IntersectionObserver below always has correct margins
    resizeObserver.observe(root);

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

  // Use an IntersectionObserver to watch for position changes.
  // This works by constructing an IntersectionObserver that
  // watches for changes in the intersection rectangle of the
  // img and the rectangle it currently occupies. When the img
  // moves, its intersection rectangle with the given rectangle
  // changes size. Since we provide a threshold of 1 for the
  // intersection ratio, a slight change in the size will trigger
  // our given callback.
  // This should be more general than the MutationObserver above
  // (i. e. it catches position changes which the MutationObserver
  // doesn't, e. g. the img sliding horizontally because the PictureInfo
  // is being hidden), but in practice, using a MutationObserver in
  // addition leads to quicker and thus smoother updates, so we keep it.
  useEffect(() => {
    if (!img || !root || !rect) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    // can't use imageRect here, since it takes the aspect ratio
    // into account, which the IntersectionObserver doesn't
    const imgRect = img.getBoundingClientRect();

    // Compute the rectangle that the img currently occupies,
    // relative to root's rectangle. Negative margins are inwards, so
    // right and bottom are the other way around.
    const rootMargin = [
      rootRect.top - imgRect.top,
      imgRect.right - rootRect.right,
      imgRect.bottom - rootRect.bottom,
      rootRect.left - imgRect.left,
    ]
      .map(margin => `${margin}px`)
      .join(' ');

    const { width, height } = imgRect;
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
        recompute(img);
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );
    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [img, root, recompute, rect]);

  return rect;
};
