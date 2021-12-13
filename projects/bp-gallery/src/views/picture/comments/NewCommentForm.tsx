import { TextField } from '@mui/material';
import React, { useState } from 'react';
import './NewCommentForm.scss';
import { Button } from '@mui/material';
import { usePostCommentMutation } from '../../../graphql/APIConnector';

const NewCommentForm = ({ pictureId }: { pictureId: string }) => {
  const [postCommentMutation, { data, loading, error }] = usePostCommentMutation({
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
      console.log(`${commentAuthor} schreibt ${commentText}`);
      const date = new Date();
      postCommentMutation({
        variables: {
          id: pictureId,
          author: commentAuthor,
          text: commentText,
          date: date.toISOString(),
        },
      });
      alert(
        'Ihr Kommentar wurde abgeschickt. Nachdem er von der Bad-Harzburg-Stiftung geprüft wurde, wird er hier veröffentlicht.'
      );
      setCommentAuthor('');
      setCommentText('');
    }
  };

  return (
    <div className='new-comment-form'>
      <div className='input-field'>
        <TextField
          id='name'
          label='Name'
          variant='outlined'
          fullWidth
          value={commentAuthor}
          onChange={handleAuthorChange}
        />
      </div>
      <div className='input-field'>
        <TextField
          id='text'
          label='Kommentar'
          required
          color='warning'
          multiline
          fullWidth
          rows={4}
          variant='outlined'
          value={commentText}
          onChange={handleTextChange}
        />
      </div>
      <div className='Submit'>
        <Button variant='outlined' onClick={postComment}>
          Absenden
        </Button>
      </div>
    </div>
  );
};

export default NewCommentForm;
