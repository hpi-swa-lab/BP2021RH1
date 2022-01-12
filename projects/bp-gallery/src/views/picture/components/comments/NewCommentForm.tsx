import React, { useState } from 'react';
import './NewCommentForm.scss';
import { Button, TextField } from '@mui/material';
import { usePostCommentMutation } from '../../../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';

const NewCommentForm = ({ pictureId }: { pictureId: string }) => {
  const { t } = useTranslation();

  const [postCommentMutation] = usePostCommentMutation();
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
          date: today.toISOString(),
        },
      });
      setCommentAuthor('');
      setCommentText('');
      //eslint-disable-next-line no-alert
      alert(t('common.comment-alert'));
    }
  };

  return (
    <div className='new-comment-form'>
      <TextField
        className='input-field'
        id='name'
        label={t('common.name')}
        variant='outlined'
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
        variant='outlined'
        value={commentText}
        onChange={handleTextChange}
        fullWidth
        multiline
        rows={4}
      />
      <div className='Submit'>
        <Button variant='outlined' onClick={postComment}>
          {t('common.submit')}
        </Button>
      </div>
    </div>
  );
};

export default NewCommentForm;
