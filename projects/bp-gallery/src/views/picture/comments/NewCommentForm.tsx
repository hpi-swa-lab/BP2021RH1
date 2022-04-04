import React, { useCallback, useContext, useState } from 'react';
import './NewCommentForm.scss';
import { Button, TextField } from '@mui/material';
import { usePostCommentMutation } from '../../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';
import { AlertContext, AlertType } from '../../shared/AlertWrapper';
import getCurrentDateTimeString from './helpers/getCurrentDateTimeString';

const NewCommentForm = ({ pictureId }: { pictureId: string }) => {
  const { t } = useTranslation();
  const openAlert = useContext(AlertContext);

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  const [postCommentMutation] = usePostCommentMutation({
    onCompleted: _ => {
      setCommentAuthor('');
      setCommentText('');
      openAlert({
        alertType: AlertType.INFO,
        message: t('common.comment-alert'),
      });
    },
    onError: error => {
      openAlert({
        alertType: AlertType.ERROR,
        message: error.message,
      });
    },
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
        },
      });
    }
  }, [commentAuthor, commentText, pictureId, postCommentMutation]);

  return (
    <div className='new-comment-form'>
      <TextField
        className='input-field'
        id='name'
        label={t('common.name')}
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
          {t('common.submit')}
        </Button>
      </div>
    </div>
  );
};

export default NewCommentForm;
