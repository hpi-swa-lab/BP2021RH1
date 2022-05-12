import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './FormattedComment.scss';
import { FlatComment } from '../../../types/additionalFlatTypes';
import { Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { useFixCommentTextMutation } from '../../../graphql/APIConnector';
import JoditEditor from 'jodit-react';
import defaultJoditConfig from '../../shared/jodit-config';

const FormattedComment = ({ comment }: { comment: FlatComment }) => {
  const { t } = useTranslation();

  const { role } = useAuth();

  const parseNewLine = (text: string) => text.replace(/\\n/gm, '\n');

  const isLong = comment.text.length > 500;

  const [isOpen, setIsOpen] = useState<boolean>(!isLong);

  return (
    <div className={`comment${isOpen ? ' open' : ''}${isLong ? ' long' : ''}`} key={comment.id}>
      <div className='comment-details'>
        <strong>{comment.author}</strong> {t('common.wrote-on')}{' '}
        {dayjs(comment.date as string).format('DD.MM.YYYY')}
        :<br />
      </div>
      {role >= AuthRole.CURATOR ? (
        <CommentEditField comment={comment} />
      ) : (
        <div className='comment-text'>{parseNewLine(comment.text)}</div>
      )}

      {isLong && (
        <Button
          className='expand-button'
          onClick={() => setIsOpen(!isOpen)}
          startIcon={<ExpandMore />}
        >
          {isOpen ? t('common.showLess') : t('common.showMore')}
        </Button>
      )}
    </div>
  );
};

const CommentEditField = ({ comment }: { comment: FlatComment }) => {
  const commentRef = useRef<FlatComment>(comment);

  const [updateComment] = useFixCommentTextMutation({
    refetchQueries: ['getPictureInfo'],
  });

  useEffect(() => {
    commentRef.current = comment;
  }, [comment]);

  const config = {
    ...defaultJoditConfig,
    readonly: false,
  };

  const onBlur = useCallback(() => {
    // Save description
    updateComment({
      variables: {
        commentId: commentRef.current.id,
        text: commentRef.current.text,
      },
    });
  }, [commentRef, updateComment]);

  return (
    <JoditEditor
      value={commentRef.current.text}
      config={config}
      onBlur={onBlur}
      onChange={newText => {
        commentRef.current.text = newText;
      }}
    />
  );
};

export default FormattedComment;
