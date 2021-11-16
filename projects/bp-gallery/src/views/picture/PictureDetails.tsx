import React from 'react';
import './PictureDetails.scss';

interface Details {
  title: Title;
  descriptions: Description[];
}
interface Title {
  text: string;
  id: number;
}
interface Description {
  text: string;
  id: number;
}

const PictureDetails = ({ details }: { details: Details }) => {
  return (
    <div className='pictureDetails'>
      <div className='title'>{details.title.text}</div>
      {details.descriptions.length > 0 &&
        details.descriptions.map((description: Description) => (
          <div key={description.id} className='description'>
            {' '}
            {description.text}
          </div>
        ))}
    </div>
  );
};

export default PictureDetails;
