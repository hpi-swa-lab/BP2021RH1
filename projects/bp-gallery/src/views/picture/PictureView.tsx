import React from 'react';
import './PictureView.scss';
import PictureDetails from './PictureDetails';
import CommentsContainer from './CommentsContainer';
import Picture from './Picture';

const PictureView = ({ pictureId }: { pictureId: number }) => {
  return (
    <div>
      <Picture />
      <PictureDetails />
      <CommentsContainer />
    </div>
  );
};

export default PictureView;
