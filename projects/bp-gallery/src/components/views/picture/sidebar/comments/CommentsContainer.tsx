import React, { memo, useEffect, useMemo, useState } from 'react';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import NewCommentForm from './NewCommentForm';
import FormattedComment from './FormattedComment';
import './CommentsContainer.scss';
import { useTranslation } from 'react-i18next';
import CommentVerification from './CommentVerification';
import { Badge, Icon, ExpandMore } from 'mui';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import LikeButton from '../LikeButton';

const CommentsContainer = memo(function CommentsContainer({
  pictureId,
  comments,
  likeCount,
}: {
  pictureId: string;
  comments?: FlatComment[];
  likeCount: number;
}) {
  const { t } = useTranslation();
  const { role } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(role < AuthRole.CURATOR);

  useEffect(() => {
    setIsOpen(role < AuthRole.CURATOR);
  }, [role]);

  const commentTree = useMemo(() => {
    if (!comments) return;

    const commentsById = Object.fromEntries(
      comments.map(comment => [comment.id, { ...comment, childComments: [] as FlatComment[] }])
    );
    for (const comment of Object.values(commentsById)) {
      if (comment.parentComment?.id) {
        commentsById[comment.parentComment.id].childComments.push(comment);
      }
    }
    return Object.values(commentsById).filter(comment => comment.parentComment === null);
  }, [comments]);

  const sortedComments = () => {
    return commentTree?.sort(
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
      <div className='picture-comments-header ' onClick={() => setIsOpen(o => !o)}>
        <div className={'flex place-items-center m-0 gap-1 w-max grow'}>
          <LikeButton pictureId={pictureId} likeCount={likeCount} />
          <div className={'flex grow'}>
            <div className='picture-comments-icon mr-2 ml-auto'>
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
});

export default CommentsContainer;
