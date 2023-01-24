import React, { useState } from 'react';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import { Badge, Card, Icon } from '@mui/material';
import CommentVerification from './CommentVerification';
import { ExpandMore } from '@mui/icons-material';
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
  const [isLiked, setIsLiked] = useState<boolean>(false);
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
      <div className='picture-comments-header '>
        <div className={'flex place-items-center m-0 gap-1 w-max grow'}>
          <Card
            className={'min-h-fit flex flex-row gap-1 align-center p-1'}
            onClick={() => setIsLiked(like => !like)}
          >
            {isLiked ? <Icon>favorite</Icon> : <Icon>favorite_border</Icon>}
            Mag ich
          </Card>
          <div className={'flex grow'} onClick={() => setIsOpen(o => !o)}>
            <div className='grow' />
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
          </div>
        </div>
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
