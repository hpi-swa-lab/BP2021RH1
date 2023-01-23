import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './FormattedComment.scss';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import { Button } from '@mui/material';
import { Delete, ExpandLess, ExpandMore, QuestionAnswer } from '@mui/icons-material';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import {
  useDeclineCommentMutation,
  useFixCommentTextMutation,
  usePinCommentMutation,
  useUnpinCommentMutation,
} from '../../../../../graphql/APIConnector';
import PushPinIcon from '@mui/icons-material/PushPin';
import Editor from '../../../../common/editor/Editor';
import EditIcon from '@mui/icons-material/Edit';
import NewCommentForm from './NewCommentForm';
import CommentVerification from './CommentVerification';
import { DialogContext, DialogPreset } from '../../../../provider/DialogProvider';

interface CommentAction {
  text: string;
  action: () => void;
  icon: JSX.Element;
  hoverText?: string;
  state?: boolean;
}

const FormattedComment = ({ comment, depth = 0 }: { comment: FlatComment; depth?: number }) => {
  const { t } = useTranslation();

  const { role } = useAuth();

  const isLong = comment.text.length > 500;
  const isCurator = role >= AuthRole.CURATOR;
  const dialog = useContext(DialogContext);

  const [isOpen, setIsOpen] = useState<boolean>(!isLong);
  const [pinned, setPinned] = useState(comment.pinned);
  const [expanded, setExpanded] = useState(true);
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);

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

  const [deleteComment] = useDeclineCommentMutation({
    variables: {
      commentId: comment.id,
    },
    refetchQueries: ['getPictureInfo'],
  });

  const onDelete = useCallback(async () => {
    const shouldRemove = await dialog({
      title: t('curator.really-decline-comment'),
      content: comment.text,
      preset: DialogPreset.CONFIRM,
    });
    if (!shouldRemove) return;
    await deleteComment();
  }, [comment.text, deleteComment, dialog, t]);

  const commentActions: CommentAction[] = useMemo(
    () => [
      {
        text: 'Antworten',
        action: () => setReply(!reply),
        icon: <QuestionAnswer />,
        hoverText: 'Antworten',
        state: reply,
      } as CommentAction,
      ...(role >= AuthRole.CURATOR
        ? [
            {
              text: 'Editieren',
              action: () => setEdit(!edit),
              icon: <EditIcon />,
              hoverText: 'Editieren',
              state: edit,
            },
            {
              text: t('common.delete'),
              action: () => onDelete(),
              icon: <Delete />,
            },
          ]
        : []),
    ],
    [t, role, reply, edit, onDelete]
  );

  return (
    <div
      className={`bg-neutral-200 comment${isLong ? ' long' : ''}${pinned ? ' pinned' : ''}${
        comment.parentComment === null ? ' rounded-lg' : ''
      }`}
      key={comment.id}
    >
      <div className='comment-details'>
        <div className='comment-details-container flex items-center'>
          <button
            className='btn bg-neutral-200'
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Kommentar einklappen' : 'Kommentar ausklappen'}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </button>
          <p className='m-0'>
            <strong>{comment.author}</strong> {t('common.wrote-on')}{' '}
            {dayjs(comment.date as string).format('DD.MM.YYYY')}:
          </p>
        </div>
        {comment.publishedAt && isCurator && !depth ? (
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
      </div>
      <div className={`ml-2 ${!expanded ? 'hidden' : ''}`}>
        {isCurator && edit ? (
          <div className={`comment-text bg-neutral-100 open mt-1`}>
            <CommentEditField comment={comment} />
          </div>
        ) : (
          <div className={`comment-text ${isOpen ? 'open' : ''} ${isLong ? 'long' : ''} mt-1`}>
            <CommentEditField comment={comment} readOnly />
          </div>
        )}
        {isLong && !edit && (
          <div className='flex items-center justify-center mt-1'>
            <Button
              className='expand-button'
              onClick={() => setIsOpen(!isOpen)}
              startIcon={<ExpandMore />}
            >
              {isOpen ? t('common.showLess') : t('common.showMore')}
            </Button>
          </div>
        )}
        <div className='flex gap-0.5 flex-wrap'>
          {comment.publishedAt &&
            commentActions.map(commentAction => (
              <button
                key={commentAction.text}
                title={commentAction.hoverText}
                className={`text-neutral-700 btn bg-neutral-200 hover:bg-neutral-300 flex items-center mt-2 gap-0.5 pl-1 text-xs ${
                  commentAction.state ? 'bg-neutral-300 ring-1' : ''
                }`}
                onClick={() => commentAction.action()}
              >
                {commentAction.icon}
                {commentAction.text}
              </button>
            ))}
        </div>
        {comment.picture && reply && (
          <div className='mt-2'>
            <NewCommentForm
              pictureId={comment.picture.id}
              parentCommentId={comment.id}
              onSubmit={() => setReply(false)}
            />
          </div>
        )}
        {comment.childComments?.length !== 0 && (
          <div className='flex mt-3'>
            <div className='w-1 bg-neutral-300 flex-shrink-0'></div>
            <div className='flex flex-col w-full'>
              {comment.childComments?.map(childComment => (
                <CommentVerification comment={childComment} key={childComment.id}>
                  <FormattedComment comment={childComment} depth={depth + 1} />
                </CommentVerification>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentEditField = ({ comment, readOnly }: { comment: FlatComment; readOnly?: boolean }) => {
  const commentRef = useRef<FlatComment>(comment);

  const [updateComment] = useFixCommentTextMutation({
    refetchQueries: ['getPictureInfo'],
  });

  useEffect(() => {
    commentRef.current = comment;
  }, [comment]);

  const onBlur = useCallback(() => {
    updateComment({
      variables: {
        commentId: commentRef.current.id,
        text: commentRef.current.text,
      },
    });
  }, [commentRef, updateComment]);

  return (
    <Editor
      value={commentRef.current.text}
      extraOptions={{ readonly: readOnly }}
      onBlur={onBlur}
      onChange={newText => {
        commentRef.current.text = newText;
      }}
    />
  );
};

export default FormattedComment;
