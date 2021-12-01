import React, { useMemo } from 'react';
import './Picture.scss';
import { apiBase } from '../../App';

const Picture = React.forwardRef(
  (
    {
      url,
      className = '',
      scrollPos,
    }: {
      url: string;
      className?: string;
      scrollPos?: number;
    },
    setImageHeightRef: any
  ) => {
    const imageLink = apiBase + url;

    const imageSize = useMemo(() => {
      const parentHeight = 0.65 * window.innerHeight;

      const calculatedHeight = parentHeight - (scrollPos ?? 0);
      console.log(calculatedHeight);

      const height = Math.min(Math.max(calculatedHeight, 150), parentHeight);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setImageHeightRef(height);
      return height;
    }, [scrollPos, setImageHeightRef]);

    return (
      <div className={`picture`}>
        <div className={'background-container'} style={{ height: `${imageSize}px` }}>
          <img src={imageLink} alt={'test'} className='blur-background' />
        </div>
        <img
          src={imageLink}
          alt={'test'}
          style={{
            height: `${imageSize}px`,
          }}
        />
      </div>
    );
  }
);

Picture.displayName = 'Picture';

export default Picture;
