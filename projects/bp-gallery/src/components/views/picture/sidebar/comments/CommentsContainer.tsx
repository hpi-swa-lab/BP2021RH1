import { ExpandMore, QuestionAnswer } from '@mui/icons-material';
import { Badge } from '@mui/material';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCanAcceptOrDeclineComment } from '../../../../../hooks/can-do-hooks';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import LikeButton from '../LikeButton';
import CommentVerification from './CommentVerification';
import './CommentsContainer.scss';
import FormattedComment from './FormattedComment';
import NewCommentForm from './NewCommentForm';

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

  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  // use the first comment (if it exists) as a representative for all,
  // since the permission is bound to an archive and all comments
  // belong to the same picture (and therefore to the same archive)
  const { canAcceptOrDeclineComment } = useCanAcceptOrDeclineComment(comments?.[0]?.id);

  const badgeNumber = useMemo(() => {
    return !canAcceptOrDeclineComment
      ? comments?.filter(elem => elem.publishedAt).length
      : comments?.length;
  }, [canAcceptOrDeclineComment, comments]);

  return (
    <div className={`picture-info-section pictureComments${isOpen ? ' open' : ''}`} id='comments'>
      <div className='picture-comments-header ' onClick={() => setIsOpen(o => !o)}>
        <div className={'flex place-items-center m-0 gap-1 w-max grow'}>
          <LikeButton pictureId={pictureId} likeCount={likeCount} />
          <div className={'flex grow'}>
            <div className='picture-comments-icon mr-2 ml-auto'>
              {isOpen || badgeNumber === 0 ? (
                <QuestionAnswer />
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
                  <QuestionAnswer />
                </Badge>
              )}
            </div>
            {t('common.comments')}
          </div>
        </div>
        <ExpandMore className='expand-button' />
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
