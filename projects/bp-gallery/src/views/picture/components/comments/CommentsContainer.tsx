import React from 'react';
import { FlatComment } from '../../../../graphql/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';

const CommentsContainer = ({
  pictureId,
  comments,
}: {
  comments?: FlatComment[];
  pictureId: string;
}) => {
  return (
    <div className='pictureComments' id='comments'>
      <div className='comment-container'>
        {comments &&
          comments.length > 0 &&
          comments.map((comment: FlatComment) => (
            <FormattedComment comment={comment} key={comment.id} />
          ))}
      </div>
      <NewCommentForm pictureId={pictureId} />
    </div>
  );
};

export default CommentsContainer;
