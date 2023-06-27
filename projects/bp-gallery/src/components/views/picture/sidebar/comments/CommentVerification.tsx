import { Close, Done } from '@mui/icons-material';
import { Button } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAcceptCommentMutation,
  useDeclineCommentMutation,
} from '../../../../../graphql/APIConnector';
import { useCanAcceptOrDeclineComment } from '../../../../../hooks/can-do-hooks';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import './CommentVerification.scss';

const CommentVerification = ({
  children,
  comment,
}: PropsWithChildren<{ comment: FlatComment }>) => {
  const dialog = useDialog();
  const { t } = useTranslation();

  const [acceptComment] = useAcceptCommentMutation({
    variables: { commentId: comment.id, currentTime: new Date().toISOString() },
    refetchQueries: [
      'getPictureInfo',
      'getDailyPictureInfo',
      'getPictures',
      'getPicturesByAllSearch',
    ],
  });

  const [declineComment] = useDeclineCommentMutation({
    variables: {
      commentId: comment.id,
    },
    refetchQueries: ['getPictureInfo'],
  });

  const onDecline = async () => {
    const shouldRemove = await dialog({
      title: t('curator.really-decline-comment'),
      content: comment.text,
      preset: DialogPreset.CONFIRM,
    });
    if (!shouldRemove) return;
    await declineComment();
  };

  const { canAcceptOrDeclineComment, canAcceptComment, canDeclineComment } =
    useCanAcceptOrDeclineComment(comment.id);

  if (!comment.publishedAt && !canAcceptOrDeclineComment) {
    return null;
  } else {
    return (
      <div
        className={`comment-verification-container${!comment.publishedAt ? ' unverified' : ''}${
          !canAcceptOrDeclineComment ? ' unstyled' : ''
        }`}
      >
        {children}
        {!comment.publishedAt && (
          <>
            {canDeclineComment && (
              <Button startIcon={<Close />} onClick={onDecline}>
                {t('common.decline')}
              </Button>
            )}
            {canAcceptComment && (
              <Button startIcon={<Done />} onClick={() => acceptComment()} variant='contained'>
                {t('common.accept')}
              </Button>
            )}
          </>
        )}
      </div>
    );
  }
};

export default CommentVerification;
