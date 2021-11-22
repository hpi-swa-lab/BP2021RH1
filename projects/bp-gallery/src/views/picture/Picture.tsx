import React from 'react';
import { apiBase } from '../../ApiConnector';
import './Picture.scss';

const Picture = ({ url }: { url: string }) => {
  const imageLink = apiBase + url;
  return (
    <div className='picture'>
      <img src={imageLink} alt={'test'} className='blur-background' />
      <img src={imageLink} alt={'test'} />
    </div>
  );
};

export default Picture;
