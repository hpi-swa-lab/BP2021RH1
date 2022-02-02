import React, { useContext, useState } from 'react';
import './NewCommentForm.scss';
import { Button, TextField } from '@mui/material';
import { usePostCommentMutation } from '../../../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';
import { AlertContext, AlertType } from '../../../../components/AlertWrapper';

const NewCommentForm = ({
  pictureId,
  externalDateString,
}: {
  pictureId: string;
  externalDateString?: string; // needed for testing
}) => {
  const { t } = useTranslation();

  const openAlert = useContext(AlertContext);
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
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentAuthor(event.target.value);
  };
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  };

  const postComment = () => {
    if (commentText !== '') {
      const today = new Date();
      postCommentMutation({
        variables: {
          id: pictureId,
          author: commentAuthor,
          text: commentText,
          date: externalDateString ? externalDateString : today.toISOString(),
        },
      });
    }
  };

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
