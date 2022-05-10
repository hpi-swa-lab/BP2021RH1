import React, { useState } from 'react';
import { FlatComment } from '../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import { Icon, IconButton } from '@mui/material';
import CommentVerification from './CommentVerification';
import { ExpandMore } from '@mui/icons-material';

const CommentsContainer = ({
  pictureId,
  comments,
}: {
  comments?: FlatComment[];
  pictureId: string;
}) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className={`picture-info-section pictureComments${isOpen ? ' open' : ''}`} id='comments'>
      <div className='picture-comments-header'>
        <h2>
          <Icon>question_answer</Icon>
          {t('common.comments')}
        </h2>
        <IconButton onClick={() => setIsOpen(o => !o)} className='expand-button'>
          <ExpandMore />
        </IconButton>
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
