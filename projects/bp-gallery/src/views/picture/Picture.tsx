import React, { useMemo } from 'react';
import './Picture.scss';
import { apiBase } from '../../App';

const Picture = ({
  url,
  scrollPos = 0,
  onPictureHeightChange = () => {},
}: {
  url: string;
  scrollPos?: number;
  onPictureHeightChange?: (height: number) => void;
}) => {
  const pictureLink = `${apiBase}${url}`;

  const pictureHeight = useMemo(() => {
    const parentHeight = 0.65 * window.innerHeight;

    const calculatedHeight = parentHeight - scrollPos;

    const height = Math.min(Math.max(calculatedHeight, 150), parentHeight);
    onPictureHeightChange(height);
    return height;
  }, [scrollPos, onPictureHeightChange]);

  return (
    <div className='picture'>
      <div className='background-container' style={{ height: `${pictureHeight}px` }}>
        <img src={pictureLink} alt={pictureLink} className='blur-background' />
      </div>
      <img
        src={pictureLink}
        alt={pictureLink}
        style={{
          height: `${pictureHeight}px`,
        }}
      />
    </div>
  );
};

export default Picture;
