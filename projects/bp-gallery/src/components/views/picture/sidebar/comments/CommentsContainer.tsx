import React, { useState } from 'react';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import { Icon } from '@mui/material';
import CommentVerification from './CommentVerification';
import { ExpandMore } from '@mui/icons-material';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { useGetCommentsByPictureQuery } from '../../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';

const CommentsContainer = ({ pictureId }: { pictureId: string }) => {
  const { t } = useTranslation();

  const { role } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(role < AuthRole.CURATOR);
  const { data, loading, error } = useGetCommentsByPictureQuery({ variables: { pictureId } });
  const comments: FlatComment[] | undefined =
    useSimplifiedQueryResponseData(data)?.picture.comments;

  const sortedComments = () => {
    return comments?.sort(
      (comment1, comment2) => Number(comment2.pinned) - Number(comment1.pinned)
    );
  };

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
        {sortedComments()?.map((comment: FlatComment) => (
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
