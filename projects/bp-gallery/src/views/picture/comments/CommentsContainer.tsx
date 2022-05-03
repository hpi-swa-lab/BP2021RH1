import React from 'react';
import { FlatComment } from '../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import { Icon } from '@mui/material';
import CommentVerification from './CommentVerification';

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
      <h2>
        <Icon>question_answer</Icon>
        {t('common.comments')}
      </h2>
      <div className='comment-container'>
        {comments?.map((comment: FlatComment) => (
          <CommentVerification comment={comment} key={comment.id}>
            <FormattedComment comment={comment} key={comment.id} />
          </CommentVerification>
        ))}
      </div>
      <NewCommentForm pictureId={pictureId} />
    </div>
  );
};

export default CommentsContainer;
