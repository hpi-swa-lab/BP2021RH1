import React from 'react';
import './Picture.scss';
import { apiBase } from '../../App';

const Picture = ({
  url,
  pictureHeight = window.innerHeight * 0.65,
}: {
  url: string;
  pictureHeight?: number;
}) => {
  const pictureLink = `${apiBase}${url}`;

  return (
    <div className='picture' id='photo'>
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
