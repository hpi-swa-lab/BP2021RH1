import { TextField } from '@mui/material';
import React, { useState } from 'react';
import './NewCommentForm.scss';
import { Button } from '@mui/material';
import { usePostCommentMutation } from '../../../graphql/APIConnector';

const NewCommentForm = ({ pictureId }: { pictureId: string }) => {
  const [postCommentMutation] = usePostCommentMutation({
    variables: {
      id: pictureId,
      author: '',
      text: '',
      date: Date.now(),
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
          date: today.toISOString(),
        },
      });
      setCommentAuthor('');
      setCommentText('');
      alert(
        'Ihr Kommentar wurde abgeschickt. Nachdem er von der Bad-Harzburg-Stiftung geprüft wurde, wird er hier veröffentlicht.'
      );
    }
  };

  return (
    <div className='new-comment-form'>
      <TextField
        className='input-field'
        id='name'
        label='Name'
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
        label='Kommentar'
        variant='outlined'
        value={commentText}
        onChange={handleTextChange}
        fullWidth
        multiline
        rows={4}
      />
      <div className='Submit'>
        <Button variant='outlined' onClick={postComment}>
          Absenden
        </Button>
      </div>
    </div>
  );
};

export default NewCommentForm;
