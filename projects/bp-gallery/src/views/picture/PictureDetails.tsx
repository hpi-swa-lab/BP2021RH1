import React from 'react';

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
      Beschreibung:{' '}
      {details.descriptions.map((description: Description) => (
        <div key={description.id}> {description.text}</div>
      ))}
    </div>
  );
};

export default PictureDetails;
