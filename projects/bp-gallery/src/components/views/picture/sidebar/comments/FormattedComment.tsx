import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './FormattedComment.scss';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import { Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import {
  useFixCommentTextMutation,
  usePinCommentMutation,
  useUnpinCommentMutation,
} from '../../../../../graphql/APIConnector';
import JoditEditor from 'jodit-react';
import defaultJoditConfig from '../../../../../helpers/jodit-config';
import PushPinIcon from '@mui/icons-material/PushPin';

const FormattedComment = ({ comment }: { comment: FlatComment }) => {
  const { t } = useTranslation();

  const { role } = useAuth();

  const parseNewLine = (text: string) => text.replace(/\\n/gm, '\n');

  const isLong = comment.text.length > 500;
  const isCurator = role >= AuthRole.CURATOR;

  const [isOpen, setIsOpen] = useState<boolean>(!isLong);
  const [pinned, setPinned] = useState(comment.pinned);

  const [pinComment] = usePinCommentMutation({
    variables: {
      commentId: comment.id,
    },
    refetchQueries: ['getPictureInfo'],
    onCompleted: () => setPinned(true),
  });

  const [unpinComment] = useUnpinCommentMutation({
    variables: {
      commentId: comment.id,
    },
    refetchQueries: ['getPictureInfo'],
    onCompleted: () => setPinned(false),
  });

  return (
    <div
      className={`comment${isOpen ? ' open' : ''}${isLong ? ' long' : ''}${
        pinned ? ' pinned' : ''
      }`}
      key={comment.id}
    >
      <div className='comment-details'>
        <div className='comment-details-container'>
          <strong>{comment.author}</strong> {t('common.wrote-on')}{' '}
          {dayjs(comment.date as string).format('DD.MM.YYYY')}:
        </div>
        {comment.publishedAt && isCurator ? (
          <button
            className={`pin-button ${pinned ? 'pinned' : ''}`}
            onClick={() => {
              pinned ? unpinComment() : pinComment();
            }}
          >
            <PushPinIcon />
          </button>
        ) : (
          comment.pinned && (
            <div className={`pinned pin-icon`}>
              <PushPinIcon />
            </div>
          )
        )}
        <br />
      </div>
      {isCurator ? (
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
