import React from 'react';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { Comment } from '../../../graphql/APIConnector';

const CommentsContainer = ({ pictureId, comments }: { comments: Comment[]; pictureId: string }) => {
  return (
    <div className='pictureComments' id='comments'>
      <div className='comment-container'>
        {comments.length > 0 &&
          comments.map((comment: Comment) => (
            <FormattedComment comment={comment} key={comment.id} />
          ))}
      </div>
      <NewCommentForm pictureId={pictureId} />
    </div>
  );
};

export default CommentsContainer;
