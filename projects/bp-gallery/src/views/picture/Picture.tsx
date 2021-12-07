import React, { useMemo } from 'react';
import './Picture.scss';
import { apiBase } from '../../App';

const Picture = React.forwardRef(
  ({ url, scrollPos = 0 }: { url: string; scrollPos?: number }, setImageHeightRef: any) => {
    const imageLink = `${apiBase}${url}`;

    const imageSize = useMemo(() => {
      const parentHeight = 0.65 * window.innerHeight;

      const calculatedHeight = parentHeight - scrollPos;

      const height = Math.min(Math.max(calculatedHeight, 150), parentHeight);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setImageHeightRef(height);
      return height;
    }, [scrollPos, setImageHeightRef]);

    return (
      <div className='picture'>
        <div className='background-container' style={{ height: `${imageSize}px` }}>
          <img src={imageLink} alt={imageLink} className='blur-background' />
        </div>
        <img
          src={imageLink}
          alt={imageLink}
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
