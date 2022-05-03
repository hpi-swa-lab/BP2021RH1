import React, { useContext } from 'react';
import { FlatComment } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { useAcceptCommentMutation, useDeclineCommentMutation } from '../../../graphql/APIConnector';
import { useApolloClient } from '@apollo/client';
import { DialogContext, DialogPreset } from '../../shared/DialogWrapper';
import { useTranslation } from 'react-i18next';

const CommentVerification = ({ children, comment }: { children: any; comment: FlatComment }) => {
  const apolloClient = useApolloClient();
  const prompt = useContext(DialogContext);
  const { t } = useTranslation();
  const { role } = useAuth();

  const [acceptComment] = useAcceptCommentMutation({
    variables: { commentId: comment.id, currentTime: new Date().toISOString() },
  });
  const [declineComment] = useDeclineCommentMutation({
    variables: {
      commentId: comment.id,
    },
  });

  const onAccept = async () => {
    await acceptComment();
    apolloClient.refetchQueries({ include: ['getPictureInfo'] });
  };
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
      <div>
        {!comment.publishedAt && (
          <>
            <span onClick={onDecline}>{t('common.decline')}</span>
            <span onClick={onAccept}>{t('common.accept')}</span>
          </>
        )}
        {children}
      </div>
    );
  }
};

export default CommentVerification;
