import { Close, Done } from '@mui/icons-material';
import { Button } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAcceptCommentMutation,
  useDeclineCommentMutation,
} from '../../../../../graphql/APIConnector';
import { useAuth } from '../../../../../hooks/context-hooks';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import { AuthRole } from '../../../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import './CommentVerification.scss';

const CommentVerification = ({
  children,
  comment,
}: PropsWithChildren<{ comment: FlatComment }>) => {
  const dialog = useDialog();
  const { t } = useTranslation();
  const { role } = useAuth();

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

  if (role < AuthRole.CURATOR && !comment.publishedAt) {
    return null;
  } else {
    return (
      <div
        className={`comment-verification-container${!comment.publishedAt ? ' unverified' : ''}${
          role < AuthRole.CURATOR ? ' unstyled' : ''
        }`}
      >
        {children}
        {!comment.publishedAt && (
          <>
            <Button startIcon={<Close />} onClick={onDecline}>
              {t('common.decline')}
            </Button>
            <Button startIcon={<Done />} onClick={() => acceptComment()} variant='contained'>
              {t('common.accept')}
            </Button>
          </>
        )}
      </div>
    );
  }
};

export default CommentVerification;
