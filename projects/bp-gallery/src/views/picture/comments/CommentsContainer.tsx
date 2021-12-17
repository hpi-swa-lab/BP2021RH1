import React from 'react';
import { ComponentContentComment } from '../../../graphql/APIConnector';
import NewCommentForm from './NewCommentForm';
import Comment from './Comment';

const CommentsContainer = ({
  pictureId,
  comments,
}: {
  comments: ComponentContentComment[];
  pictureId: string;
}) => {
  return (
    <div className='pictureComments' id='comments'>
      <Comment comments={comments} />
      <NewCommentForm pictureId={pictureId} />
    </div>
  );
};

export default CommentsContainer;
