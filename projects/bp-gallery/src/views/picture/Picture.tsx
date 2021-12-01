import React, { ForwardedRef, useMemo, useState } from 'react';
import './Picture.scss';
import { apiBase } from '../../App';

const Picture = React.forwardRef(
  (
    {
      url,
      className = '',
      scrollPos,
      scrollHeight,
      containerRef,
    }: {
      url: string;
      className?: string;
      scrollPos?: number;
      scrollHeight?: number;
      containerRef?: HTMLElement;
    },
    ref: ForwardedRef<HTMLImageElement>
  ) => {
    const imageLink = apiBase + url;
    const [loaded, setLoaded] = useState<boolean>(false);
    const scrollSpeed = 0.5;

    const imageYPos = useMemo(() => {
      if (!loaded || !(ref as any)?.current) {
        return 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const rect = (ref as any).current.getBoundingClientRect();
      return Math.max(
        -(scrollPos ?? 0) * scrollSpeed + window.innerHeight * 0.325 - rect.height / 2,
        0
      );
    }, [scrollPos, loaded, ref]);

    const imageSize = useMemo(() => {
      const containerHeight = containerRef?.getBoundingClientRect()?.height ?? 1;
      const progress = (scrollPos ?? 0) / containerHeight;
      const winh = window.innerHeight * 0.65;
      console.log(progress);
      const curHeight = Math.max(150, winh - progress * winh);
      return `min(100%, ${curHeight}px)`;
    }, [scrollPos, containerRef]);

    const backgroundHeight = useMemo(() => {
      if (!(ref as any)?.current) {
        return window.innerHeight * 0.65;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const rect = (ref as any).current.getBoundingClientRect();
      return Math.max(-(scrollPos ?? 0) + window.innerHeight * 0.65, Number(rect.height || 0));
    }, [scrollPos, ref]);

    return (
      <div className={`picture`}>
        <div className={'background-container'} style={{ height: `${backgroundHeight}px` }}>
          <img src={imageLink} alt={'test'} className='blur-background' />
        </div>
        <img
          src={imageLink}
          alt={'test'}
          ref={ref}
          style={{
            top: `${imageYPos}px`,
            maxHeight: `${imageSize}`,
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }
);

Picture.displayName = 'Picture';

export default Picture;
