import React from 'react';
import { FlatDescription } from '../../../graphql/additionalFlatTypes';
import './PictureDetails.scss';

const PictureDetails = ({ descriptions }: { descriptions?: FlatDescription[] }) => {
  return (
    <div className='picture-info-section pictureDetails' id='info'>
      {descriptions &&
        descriptions.length > 0 &&
        descriptions.map((description: FlatDescription) => (
          <div key={description.id} className='description'>
            {' '}
            {description.text}
          </div>
        ))}
    </div>
  );
};

export default PictureDetails;
