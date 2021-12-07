import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './Comment.scss';
import { ComponentContentComment } from '../../../graphql/APIConnector';

const Comment = ({ comments }: { comments: ComponentContentComment[] }) => {
  const { t } = useTranslation();

  return (
    <div className='comment-container'>
      {comments.length > 0 &&
        comments.map((comment: ComponentContentComment) => (
          <div className='comment' key={comment.id}>
            <div className='comment-details'>
              {comment.author} {t('common.wrote-on')}{' '}
              {dayjs(comment.date as string).format('DD.MM.YYYY')}:<br />
            </div>
            <div className='comment-text'>&quot; {comment.text} &quot;</div>
          </div>
        ))}
    </div>
  );
};

export default Comment;
