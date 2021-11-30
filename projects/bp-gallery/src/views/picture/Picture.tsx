import React, { ForwardedRef, useMemo, useState } from 'react';
import { apiBase } from '../../ApiConnector';
import './Picture.scss';

const Picture = React.forwardRef(
  (
    {
      url,
      className = '',
      scrollPos,
      scrollHeight,
    }: {
      url: string;
      className?: string;
      scrollPos?: number;
      scrollHeight?: number;
      ref: any;
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
      const rect = (ref as any).current.getBoundingClientRect();
      return Math.max(
        -(scrollPos ?? 0) * scrollSpeed + window.innerHeight * 0.325 - rect.height / 2,
        0
      );
    }, [scrollPos, loaded, ref]);

    const imageSize = useMemo(() => {
      //return Math.max(50, Math.round(90 - (scrollPos ?? 90)));
      return Math.max(50, 90 - (scrollPos ?? 0) / 5);
      //return Math.max(50, Math.min(90, (scrollPos ?? 90) * 0.25));
      //return Math.max(0.5, 100 / (scrollPos ?? 100));
    }, [scrollPos]);

    const backgroundHeight = useMemo(() => {
      if (!(ref as any)?.current) {
        return window.innerHeight * 0.65;
      }
      const rect = (ref as any).current.getBoundingClientRect();
      return Math.max(-(scrollPos ?? 0) + window.innerHeight * 0.65, rect.height);
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
            maxHeight: `${imageSize}%`,
            //transform: `scaleY(${imageSize})`,
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }
);

export default Picture;
