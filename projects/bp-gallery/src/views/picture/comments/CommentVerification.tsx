import React, { useContext } from 'react';
import { FlatComment } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { useAcceptCommentMutation, useDeclineCommentMutation } from '../../../graphql/APIConnector';
import { useApolloClient } from '@apollo/client';
import { DialogContext, DialogPreset } from '../../shared/DialogWrapper';
import { useTranslation } from 'react-i18next';
import './CommentVerification.scss';
import { Button } from '@mui/material';
import { Close, Delete, Done } from '@mui/icons-material';

const CommentVerification = ({ children, comment }: { children: any; comment: FlatComment }) => {
  const apolloClient = useApolloClient();
  const prompt = useContext(DialogContext);
  const { t } = useTranslation();
  const { role } = useAuth();

  const [acceptComment] = useAcceptCommentMutation({
    variables: { commentId: comment.id, currentTime: new Date().toISOString() },
    refetchQueries: ['getPictureInfo'],
  });
  const [declineComment] = useDeclineCommentMutation({
    variables: {
      commentId: comment.id,
    },
    refetchQueries: ['getPictureInfo'],
  });

  const onDecline = async () => {
    const shouldRemove = await prompt({
      title: t('curator.really-decline-comment'),
      content: comment.text,
      preset: DialogPreset.CONFIRM,
    });
    if (!shouldRemove) return;
    await declineComment();
    apolloClient.refetchQueries({ include: ['getPictureInfo'] });
  };

  if (role < AuthRole.CURATOR && !comment.publishedAt) return null;
  else {
    return (
      <div className={`comment-verification-container${!comment.publishedAt ? ' unverified' : ''}`}>
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
        {comment.publishedAt && role >= AuthRole.CURATOR && (
          <Button className='delete' startIcon={<Delete />} onClick={onDecline}>
            {t('common.delete')}
          </Button>
        )}
      </div>
    );
  }
};

export default CommentVerification;
