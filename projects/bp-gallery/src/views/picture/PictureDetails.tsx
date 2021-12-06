import React from 'react';
import { Description } from '../../graphql/APIConnector';
import './PictureDetails.scss';

const PictureDetails = ({ descriptions }: { descriptions?: Description[] }) => {
  return (
    <div className='pictureDetails'>
      {descriptions &&
        descriptions.length > 0 &&
        descriptions.map((description: Description) => (
          <div key={description.id} className='description'>
            {' '}
            {description.text}
          </div>
        ))}
    </div>
  );
};

export default PictureDetails;
