import { Done, DoneAll } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePostCommentMutation } from '../../../../../graphql/APIConnector';
import { AlertContext, AlertType } from '../../../../provider/AlertProvider';
import { useDialog } from '../../../../provider/DialogProvider';
import getCurrentDateTimeString from './helpers/getCurrentDateTimeString';
import './NewCommentForm.scss';

const NewCommentForm = ({
  pictureId,
  parentCommentId,
  onSubmit,
}: {
  pictureId: string;
  parentCommentId?: string;
  onSubmit?: () => void;
}) => {
  const { t } = useTranslation();
  const openAlert = useContext(AlertContext);
  const dialog = useDialog();

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  const [postCommentMutation] = usePostCommentMutation({
    onCompleted: _ => {
      setCommentAuthor('');
      setCommentText('');
      if (localStorage.getItem('dontShowCommentDialogAgain') === '1') {
        openAlert({
          alertType: AlertType.INFO,
          message: t('comment.alert'),
          duration: 7000,
        });
        return;
      }
      dialog({
        title: t('comment.thanks'),
        content: t('comment.alert'),
        options: [
          {
            name: t('common.dontShowAgain'),
            value: true,
            icon: <DoneAll />,
            color: '#5a5a5a',
          },
          {
            name: t('common.ok'),
            value: false,
            icon: <Done />,
          },
        ],
      }).then(shouldNeverShowAgain => {
        if (shouldNeverShowAgain) {
          localStorage.setItem('dontShowCommentDialogAgain', '1');
        }
      });
    },
    refetchQueries: ['getPictureInfo'],
  });

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentAuthor(event.target.value);
  };
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  };

  const postComment = useCallback(() => {
    if (commentText !== '') {
      postCommentMutation({
        variables: {
          id: pictureId,
          author: commentAuthor,
          text: commentText,
          date: getCurrentDateTimeString(),
          parentCommentId: parentCommentId,
        },
      }).then(() => onSubmit?.());
    }
  }, [commentText, postCommentMutation, pictureId, commentAuthor, parentCommentId, onSubmit]);

  return (
    <div
      className='new-comment-form'
      onKeyUp={event => {
        event.stopPropagation();
      }}
    >
      <TextField
        className='input-field'
        id='name'
        label={t('comment.name')}
        variant='filled'
        fullWidth
        value={commentAuthor}
        onChange={handleAuthorChange}
      />

      <TextField
        className='input-field'
        InputLabelProps={{ className: 'textfield__label' }}
        InputProps={{ className: 'border__label' }}
        id='text'
        label={t('common.comment')}
        variant='filled'
        value={commentText}
        onChange={handleTextChange}
        fullWidth
        multiline
        rows={4}
      />
      <div className='Submit'>
        <Button variant='contained' type='submit' onClick={postComment}>
          {t('comment.submit')}
        </Button>
      </div>
    </div>
  );
};

export default NewCommentForm;
