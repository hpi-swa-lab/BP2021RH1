import React from 'react';
import { apiBase } from '../../ApiConnector';

const Picture = ({ url }: { url: string }) => {
  const imageLink = apiBase + url;
  return (
    <div className='picture'>
      <img src={imageLink} alt={'test'} />
    </div>
  );
};

export default Picture;
