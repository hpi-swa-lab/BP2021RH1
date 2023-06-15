import {
  Close,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  PushPin,
  QuestionAnswer,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunDeclineCommentMutation,
  useCanRunFixCommentTextMutation,
  useCanRunPinCommentMutation,
  useCanRunUnpinCommentMutation,
  useDeclineCommentMutation,
  useFixCommentTextMutation,
  usePinCommentMutation,
  useUnpinCommentMutation,
} from '../../../../../graphql/APIConnector';
import { FlatComment } from '../../../../../types/additionalFlatTypes';
import CollapsibleContainer from '../../../../common/CollapsibleContainer';
import RichText from '../../../../common/RichText';
import TextEditor from '../../../../common/editors/TextEditor';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import { getIsLong } from './../../../../../helpers/get-linebreaks';
import CommentVerification from './CommentVerification';
import './FormattedComment.scss';
import NewCommentForm from './NewCommentForm';

interface CommentAction {
  text: string;
  action: () => void;
  icon: JSX.Element;
  hoverText?: string;
  state?: boolean;
}

const getDescendants = (comment: FlatComment, descendants: string[] = []): string[] => {
  if (!comment.childComments) return [];
  descendants.push(...comment.childComments.map(childComment => childComment.id));
  comment.childComments.forEach(childComment => getDescendants(childComment, descendants));
  return descendants;
};

const FormattedComment = ({ comment, depth = 0 }: { comment: FlatComment; depth?: number }) => {
  const { t } = useTranslation();

  const [long, setLong] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const dialog = useDialog();

  useEffect(() => {
    setLong(getIsLong(textRef.current, comment.text, 9));
  }, [comment.text]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  const { canRun: canPinComment } = useCanRunPinCommentMutation({
    variables: {
      commentId: comment.id,
    },
  });

  const [unpinComment] = useUnpinCommentMutation({
    variables: {
      commentId: comment.id,
    },
    refetchQueries: ['getPictureInfo'],
    onCompleted: () => setPinned(false),
  });
  const { canRun: canUnpinComment } = useCanRunUnpinCommentMutation({
    variables: {
      commentId: comment.id,
    },
  });

  const [deleteComment] = useDeclineCommentMutation({
    refetchQueries: [
      'getPictureInfo',
      'getDailyPictureInfo',
      'getPictures',
      'getPicturesByAllSearch',
    ],
  });
  const { canRun: canDeleteComment } = useCanRunDeclineCommentMutation({
    variables: {
      // use the current comment as a representative for all the children,
      // since the permission is bound to an archive and all
      // child comments belong to the same archive
      commentId: comment.id,
    },
  });

  const onDelete = useCallback(async () => {
    const deletedComments = getDescendants(comment);

    const shouldRemove = await dialog({
      title: t('curator.really-decline-comment'),
      content: (
        <>
          <span>{comment.text}</span>
          <br />
          {comment.childComments?.length !== 0 && (
            <span className='text-red-800'>
              {t('curator.really-decline-comment-descendants', {
                count: deletedComments.length,
              })}
            </span>
          )}
        </>
      ),
      preset: DialogPreset.CONFIRM,
    });
    if (!shouldRemove) return;

    deletedComments.push(comment.id);

    deletedComments.forEach(deletedComment =>
      deleteComment({ variables: { commentId: deletedComment } })
    );
  }, [dialog, t, comment, deleteComment]);

  const { canRun: canUpdateComment } = useCanRunFixCommentTextMutation({
    variables: {
      commentId: comment.id,
    },
  });

  const commentActions: CommentAction[] = useMemo(
    () => [
      {
        text: 'Antworten',
        action: () => setReply(!reply),
        icon: !reply ? <QuestionAnswer /> : <Close />,
        hoverText: 'Antworten',
        state: reply,
      } as CommentAction,
      ...(canUpdateComment
        ? [
            {
              text: 'Editieren',
              action: () => setEdit(!edit),
              icon: !edit ? <Edit /> : <Close />,
              hoverText: 'Editieren',
              state: edit,
            },
          ]
        : []),
      ...(canDeleteComment
        ? [
            {
              text: t('common.delete'),
              action: () => onDelete(),
              icon: <Delete />,
            },
          ]
        : []),
    ],
    [t, reply, canUpdateComment, edit, canDeleteComment, onDelete]
  );

  return (
    <div
      className={`bg-neutral-200 comment${long ? ' long' : ''}${pinned ? ' pinned' : ''}${
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
        {comment.publishedAt && (pinned ? canUnpinComment : canPinComment) && !depth ? (
          <button
            className={`pin-button ${pinned ? 'pinned' : ''}`}
            onClick={() => {
              pinned ? unpinComment() : pinComment();
            }}
          >
            <PushPin />
          </button>
        ) : (
          comment.pinned && (
            <div className={`pinned pin-icon`}>
              <PushPin />
            </div>
          )
        )}
      </div>
      <div className={`ml-2 ${!expanded ? 'hidden' : ''}`}>
        <CollapsibleContainer
          collapsedHeight='250px'
          long={long && !edit}
          onToggle={open => setIsOpen(open)}
        >
          {canUpdateComment && edit ? (
            <div className={`text-lg break-words bg-neutral-100 mt-1`}>
              <CommentEditField comment={comment} />
            </div>
          ) : (
            <div
              className={`text-lg break-words ${isOpen ? '' : 'line-clamp-[9] !overflow-visible'}
              } mt-1`}
            >
              <RichText value={comment.text} textRef={textRef} />
            </div>
          )}
        </CollapsibleContainer>
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
    <TextEditor
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
