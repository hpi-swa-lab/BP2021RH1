import React from 'react';
import Comment, { CommentInfo } from './Comment';
import NewCommentForm from './NewCommentForm';

const CommentsContainer = ({ comments }: { comments: CommentInfo[] }) => {
  return (
    <div className='pictureComments'>
      <Comment comments={comments} />
      <NewCommentForm />
    </div>
  );
};

export default CommentsContainer;
