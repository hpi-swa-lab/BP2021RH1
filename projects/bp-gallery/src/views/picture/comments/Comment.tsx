import React from 'react';
import dayjs from 'dayjs';
import './Comment.scss';

export interface CommentInfo {
  author: string;
  text: string;
  id: number;
  date: string;
}

const Comment = ({ comments }: { comments: CommentInfo[] }) => {
  return (
    <div className='comment-container'>
      {comments.length > 0 &&
        comments.map((comment: CommentInfo) => (
          <div className='comment' key={comment.id}>
            <div className='comment-details'>
              {comment.author} schrieb am {dayjs(comment.date).format('DD.MM.YYYY')} : <br />
            </div>

            <div className='comment-text'> &quot; {comment.text} &quot; </div>
          </div>
        ))}
    </div>
  );
};

export default Comment;
