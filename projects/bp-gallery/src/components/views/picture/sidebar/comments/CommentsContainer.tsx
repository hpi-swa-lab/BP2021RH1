import React, { useState } from 'react';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import CommentVerification from './CommentVerification';
import { Badge, Icon, ExpandMore } from 'mui';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';

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

  const sortedComments = () => {
    return comments?.sort(
      (comment1, comment2) => Number(comment2.pinned) - Number(comment1.pinned)
    );
  };

  const badgeNumber = (() => {
    return role < AuthRole.CURATOR
      ? comments?.filter(elem => elem.publishedAt).length
      : comments?.length;
  })();

  return (
    <div className={`picture-info-section pictureComments${isOpen ? ' open' : ''}`} id='comments'>
      <div className='picture-comments-header' onClick={() => setIsOpen(o => !o)}>
        <h2>
          <div className='picture-comments-icon'>
            {isOpen || badgeNumber === 0 ? (
              <Icon>question_answer</Icon>
            ) : (
              <Badge
                badgeContent={badgeNumber}
                color='info'
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                max={99}
              >
                <Icon>question_answer</Icon>
              </Badge>
            )}
          </div>
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
