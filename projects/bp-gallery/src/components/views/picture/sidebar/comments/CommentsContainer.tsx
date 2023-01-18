import React, { useState } from 'react';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import { Badge, Icon } from '@mui/material';
import CommentVerification from './CommentVerification';
import { ExpandMore } from '@mui/icons-material';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { useGetCommentsByPictureIdQuery } from '../../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';

const CommentsContainer = ({ pictureId }: { pictureId: string }) => {
  const { t } = useTranslation();
  const { role } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(role < AuthRole.CURATOR);

  const { data } = useGetCommentsByPictureIdQuery({
    variables: {
      pictureId: pictureId,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const comments: FlatComment[] | undefined = useSimplifiedQueryResponseData(data)?.comments;

  const sortedComments = () => {
    return comments
      ?.filter(comment => comment.parentComment === null)
      ?.sort((comment1, comment2) => Number(comment2.pinned) - Number(comment1.pinned));
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
            <FormattedComment comment={comment} comments={comments} />
          </CommentVerification>
        ))}
      </div>
      <NewCommentForm pictureId={pictureId} />
    </div>
  );
};

export default CommentsContainer;
