import React, { useState } from 'react';
import { FlatComment } from '../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import { Icon } from '@mui/material';
import CommentVerification from './CommentVerification';
import { ExpandMore } from '@mui/icons-material';
import { AuthRole, useAuth } from '../../../AuthWrapper';

const CommentsContainer = ({
  pictureId,
  comments,
}: {
  comments?: FlatComment[];
  pictureId: string;
}) => {
  const { t } = useTranslation();

  const { role } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(role < AuthRole.CURATOR);

  return (
    <div className={`picture-info-section pictureComments${isOpen ? ' open' : ''}`} id='comments'>
      <div className='picture-comments-header' onClick={() => setIsOpen(o => !o)}>
        <h2>
          <Icon>question_answer</Icon>
          {t('common.comments')}
        </h2>
        <ExpandMore />
      </div>
      <div className='comment-container'>
        {comments?.map((comment: FlatComment) => (
          <CommentVerification comment={comment} key={comment.id}>
            <FormattedComment comment={comment} />
          </CommentVerification>
        ))}
      </div>
      <NewCommentForm pictureId={pictureId} />
    </div>
  );
};

export default CommentsContainer;
