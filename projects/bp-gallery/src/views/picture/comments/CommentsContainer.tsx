import React from 'react';
import { FlatComment } from '../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';

const CommentsContainer = ({
  pictureId,
  comments,
}: {
  comments?: FlatComment[];
  pictureId: string;
}) => {
  const { t } = useTranslation();

  return (
    <div className='picture-info-section pictureComments' id='comments'>
      <h2>{t('common.comments')}</h2>
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
