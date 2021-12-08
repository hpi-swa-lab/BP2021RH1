import React from 'react';
import './NewCommentForm.scss';

const NewCommentForm = () => {
  return (
    <form className={'new-comment-form'}>
      <div className={'name'}>
        Name
        <input id='name' type='text' name='name' />
        <br />
      </div>

      <div className={'text'}>
        Kommentar
        <input id='text' type='text' name='text' />
        <br />
      </div>
    </form>
  );
};

export default NewCommentForm;
