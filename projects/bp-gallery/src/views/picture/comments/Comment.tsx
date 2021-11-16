import React from 'react';

export interface CommentInfo {
  name: string;
  text: string;
  id: number;
}

const Comment = ({ comments }: { comments: CommentInfo[] }) => {
  return (
    <div className='comment'>
      {comments.length > 0 &&
        comments.map((comment: CommentInfo) => (
          <div className='comment' key={comment.id}>
            {comment.text}
          </div>
        ))}
    </div>
  );
};

export default Comment;
