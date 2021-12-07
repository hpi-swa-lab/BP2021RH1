import React from 'react';
import { ComponentContentComment } from '../../../graphql/APIConnector';
import NewCommentForm from './NewCommentForm';
import Comment from './Comment';

const CommentsContainer = ({ comments }: { comments: ComponentContentComment[] }) => {
  return (
    <div className='pictureComments'>
      <Comment comments={comments} />
      <NewCommentForm />
    </div>
  );
};

export default CommentsContainer;
